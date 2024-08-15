import express from "express";
import bodyParser from "body-parser";
import { readKafka, saveKafka } from "./Routes/KafkaRoutes";

export const createServer = () => {
  const app = express();
  app.use(bodyParser.json());

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.post("/send-kafka", saveKafka);
  app.get("/read-kafka", readKafka);

  return app;
};
