import cookieParser from "cookie-parser";
import express from "express";
import "dotenv/config"
import routeClient from "./routes/index.route";
import { connectDatabase } from "./config/database";
const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cookieParser());
connectDatabase();

app.use("/api/client", routeClient)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});