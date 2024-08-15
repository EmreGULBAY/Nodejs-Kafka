import { saveToKafka } from "../Services/BusinessService";
import {
  runConsumer,
} from "../Services/KafkaService";
import { Request, Response } from "express";

export const saveKafka = async (req: Request, res: Response) => {
  try {
    const message = req.body.message;
    if (!message) {
      return res.status(400).send("Message is required");
    }
    const producerRes = await saveToKafka(req.body.message);
    res.status(producerRes.status).send(producerRes.msg);
  } catch (error) {
    res.status(500).send(error || "Failed to send message");
  }
};

export const readKafka = async (req: Request, res: Response) => {
  try {
    const consumerRes = await runConsumer();
    res.status(consumerRes.status).send(consumerRes.msg);
  } catch (err) {
    res.status(500).send(err || "Failed to read messages");
  }
};
