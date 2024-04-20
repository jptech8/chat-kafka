const { kafka } = require("../index");

const producer = kafka.producer();

const ProducerService = async (topic, message) => {
  try {
    const producer = kafka.producer();
    producer
      .connect()
      .then(async () => {
        await producer.send({
          topic,
          messages: [{ value: message }],
        });
        console.log(`Message sent successfully to topic: ${topic}`);
      })
      .catch((err) => {
        console.error("There was an error in the Kafka producer", err);
      });
  } catch (err) {
    console.error("Error sending message:", err);
  }
};

module.exports = { ProducerService };
