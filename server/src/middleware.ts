import { verify } from "hono/jwt";
import { connectPrisma } from ".";

// Middleware to check if the user exists
export const checkUser = async (c, next) => {
  try {
    const prisma = connectPrisma(c.env.DATABASE_URL);
    const body = await c.req.json();

    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      await next();
    } else {
      // Finalize the response when the user already exists
      c.res = new Response(JSON.stringify({ message: "User already exists" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error in checkUser middleware:", error);
    c.res = new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const authMiddleware = async (c, next) => {
  try {
    const token = await c.req.header("Authorization");
    if (token !== undefined) {
      const trimedToken = token.replace("Bearer ", "");
      const decoded = await verify(trimedToken, "secret");
      const user = await connectPrisma(c.env.DATABASE_URL).user.findUnique({
        where: {
          email: decoded.email,
        },
      });
      if (user) {
        c.set("userId", user.id);
        await next();
      } else {
        c.text("unauthorized user");
      }
    } else {
      c.text("No token provided");
    }
  } catch (error) {
    c.text("unauthorized user");
  }
};
