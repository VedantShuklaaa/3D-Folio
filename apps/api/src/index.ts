import express from "express";

const app = express();

const PORT = 3000;

app.get("/health", (req, res) => {
	res.status(200).json({
		status: 'ok',
		uptime: process.uptime(),
		timestamp: new Date().toISOString(),
	});
});

app.listen(PORT, () => {
	console.log(`server is currently running on PORT: ${PORT}`)
})