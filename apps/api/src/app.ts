import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorMiddleware } from "./middlewares/auth.middleware.js";
import { corsOptions } from "./config/cors.js";
import { notFoundMiddleware } from "./middlewares/notfound.middleware.js";
import routes from "./routes/index.js";

const app = express();

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

app.use("/", routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;