const { kafka, rl } = require("../index");
const { ConsumerService } = require("../consumer/consumer");

const ConsumerCMDCli = () => {
  try {
    rl.question("Enter topic: ", async (topic) => {
      await ConsumerService(topic);
      rl.close();
    });
  } catch (error) {
    console.error("Error fetching message:", err);
  }
};
ConsumerCMDCli();
