import { Kafka, Producer, Consumer } from "kafkajs";

let producer: Producer | null = null;
let consumer: Consumer | null = null;
let isConsumerRunning = false;

const createKafka = () => {
  return new Kafka({
    clientId: "node-kafka-app",
    brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
  });
};

export const getProducer = async () => {
  try {
    if (!producer) {
      const kafka = createKafka();
      producer = kafka.producer();
      await producer.connect();
      console.log("Producer connected");
    }
    return producer;
  } catch (err) {
    console.error("Failed to get or create producer:", err);
    return null;
  }
};

const getConsumer = async () => {
  try {
    if (!consumer) {
      const kafka = createKafka();
      consumer = kafka.consumer({ groupId: "test-group" });

      let retries = 5;
      while (retries > 0) {
        try {
          await consumer.connect();
          console.log("Consumer connected");
          break;
        } catch (err) {
          console.error("Failed to connect consumer. Retrying...", err);
          retries--;
          if (retries === 0) {
            throw new Error("Failed to connect consumer after retries");
          }
          await new Promise((res) => setTimeout(res, 2000));
        }
      }
    }

    if (!isConsumerRunning) {
      await consumer.subscribe({ topic: "test-topic", fromBeginning: true });
      console.log("Consumer subscribed to topic");
    }
    return consumer;
  } catch (err) {
    console.error("Failed to get or create consumer:", err);
    return null;
  }
};

export const runConsumer = async () => {
  const consumer = await getConsumer();
  if (!consumer) {
    return { status: 500, msg: "Consumer is not available!" };
  }

  if (!isConsumerRunning) {
    consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          partition,
          offset: message.offset,
          value: message.value?.toString(),
        });
      },
    });
    isConsumerRunning = true;
    return {
      status: 200,
      msg: "Consumer started and is listening to messages.",
    };
  } else {
    return {
      status: 200,
      msg: "Consumer is already running and listening to messages.",
    };
  }
};
