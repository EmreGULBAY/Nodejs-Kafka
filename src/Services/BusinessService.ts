import { getProducer } from "./KafkaService";

export const saveToKafka = async (message: string) => {
  try {
    const producer = await getProducer();
    if (!producer) {
      return { status: 500, msg: "Producer is not available!" };
    }
    await producer.send({
      topic: "test-topic",
      messages: [{ value: message }],
    });
    return { status: 200, msg: "Message sent successfully!" };
  } catch (err) {
    return { status: 500, msg: "Server Error" };
  }
};
