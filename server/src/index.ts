import { Hono } from "hono";
import { Prisma, PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { authMiddleware, checkUser } from "./middleware";
import { decode, sign, verify } from "hono/jwt";
import userRouter from "./routes/user";
import blogRouter from "./routes/blog";
import { cors } from "hono/cors";

const app = new Hono<{
  Bindings: { DATABASE_URL: string; JWT_SECRET: string };
}>();

app.use(cors({ origin: "*" }));

app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);
export const connectPrisma = (url: string) => {
  return new PrismaClient({
    datasourceUrl: url,
  }).$extends(withAccelerate());
};

export default app;
