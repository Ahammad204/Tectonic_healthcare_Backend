import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
	NextFunction,
  type Application,
  type Request,
  type Response,
} from "express";
import httpStatus from "http-status";
import config from "./app/config";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import { AuthRoutes } from "./app/module/auth/auth.route";
import z from "zod";

const app: Application = express();

app.use(
  cors({
    origin: config.frontend_url,
    credentials: true,
  }),
);

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", AuthRoutes);
app.post("/zod", (req: Request, res: Response, next: NextFunction) => {
  try {
    const UserZodSchema = z.object({
      name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long" }),
      email: z.string().email({ message: "Invalid email address" }),
      password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" }),
    });

    const payload = req.body;

    const result = UserZodSchema.parse(payload);

	res.status(httpStatus.OK).json({
		success: true,
		message: "Validation successful",
		data: result,
	});


  } catch (error) {
		next(error);
  }
});

// Basic route
app.get("/", async (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "Welcome to Tectonic Healthcare System Backend",
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
