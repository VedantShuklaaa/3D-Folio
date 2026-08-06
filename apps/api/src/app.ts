import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { corsOptions } from "./config/cors.js";
import routes from "./routes/index.js";
import { errorMiddleware } from "./middlewares/auth.middleware.js";
import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { rateLimit } from "./middlewares/rateLimit.middleware.js";

const app = express();

app.set("trust proxy", 1);

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
	res.status(200).json({
		status: "ok",
		uptime: process.uptime(),
		timestamp: new Date().toISOString(),
	});
});

app.use(rateLimit);
app.use("/", routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;