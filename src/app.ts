import express from "express";
import cors from "cors";
import morgan from "morgan";
import pollRoute from "./routes/pollRoute";

const app = express();

app.use(
  cors({
    allowedHeaders: "*, auth",
  }),
);

app.use(morgan("dev"));

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use("/api/polls", pollRoute);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Backend server is running on port ${process.env.PORT}`);
});

export default app;
