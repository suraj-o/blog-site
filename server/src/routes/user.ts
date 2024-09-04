import { authMiddleware, checkUser } from "../middleware";
import bcrypt from "bcryptjs";
import { sign } from "hono/jwt";
import { connectPrisma } from "../index";
import { Hono } from "hono";
import z from "zod";

const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

const signUpInput = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  password: z.string().min(6),
});

const signInInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
// interface signupUser {
//   email: string;
//   name: string;
//   password: string;
// }
// interface signinUser {
//   email: string;
//   password: string;
// }
// authmiddleware call

// test route
userRouter.get("/test", async (c) => {
  return c.text("test route");
});
// signup route
userRouter.post("/signup", checkUser, async (c) => {
  const prisma = connectPrisma(c.env.DATABASE_URL);
  const body = await c.req.json();
  const { success } = signUpInput.safeParse(body);
  if (!success) return c.json({ massage: "invalid user" });
  const hashedPassword = await bcrypt.hashSync(body.password, 10);
  await prisma.user.create({
    data: {
      email: body.email,
      name: body.name,
      password: hashedPassword,
    },
  });
  const token = await sign({ email: body.email }, "secret");

  return c.json({
    token: token,
    massage: "signup complete",
    name: body.name,
  });
});
// sigin route
userRouter.post("/signin", async (c) => {
  try {
    const prisma = connectPrisma(c.env.DATABASE_URL);
    const body = await c.req.json();
    if (body) {
      const { success } = signInInput.safeParse(body);
      if (!success) return c.json({ massage: "invalid user" });
      const user = await prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });
      const hashedPassword = await bcrypt.hashSync(body.password, 10);
      if (user) {
        if (user.password !== hashedPassword) {
          const token = await sign({ email: user.email }, "secret");

          return c.json({
            token: token,
            massage: "signin complete",
            name: user.name,
          });
        }
      }
    }
  } catch (error) {
    return c.text("error");
  }
});
userRouter.get("/profile", authMiddleware, async (c) => {
  try {
    const prisma = connectPrisma(c.env.DATABASE_URL);
    const userId = c.get("userId");

    if (!userId) {
      return c.json({ error: "User ID not found in request context" }, 400);
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        email: true,
        bio: true,
        posts: true,
      },
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return c.json({ error: "Unable to fetch user profile" }, 500);
  }
});

userRouter.put("/profile", authMiddleware, async (c) => {
  try {
    const prisma = connectPrisma(c.env.DATABASE_URL);
    const userId = c.get("userId");
    const { name, bio, post } = await c.req.json();

    // Update user information
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: name,
        bio: bio,
      },
    });

    // Update published status of a single user post

    // Fetch updated user profile with posts
    const updatedProfile = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        email: true,
        bio: true,
        posts: true,
      },
    });

    return c.json(updatedProfile);
  } catch (error) {
    console.error("Error updating user profile:", error);
    return c.json({ error: "Unable to update user profile" }, 500);
  }
});

export default userRouter;
