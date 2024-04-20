const { rl } = require("../index");
const { ProducerService } = require("../producer/producer");

const ProduceCMDCli = () => {
  try {
    rl.question("Enter topic: ", async (topic) => {
      rl.question("Enter message: ", async (message) => {
        await ProducerService(topic, message);
        rl.close();
      });
    });
  } catch (error) {
    console.error("Error sending message:", err);
  }
};

ProduceCMDCli();
