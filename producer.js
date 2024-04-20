const { kafka, client } = require('./index.js');
const { createInterface } = require('readline');

// Initialize Kafka producer
const Producer = kafka.Producer;
const producer = new Producer(client);

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

// Producer setup (assuming you have a working producer initialization)
producer.on('ready', function () {
  rl.question('Enter topic: ', (topic) => {
    rl.question('Enter message: ', (message) => {
      // Ensure producer is ready before sending messages
      // Create the message payload with the retrieved topic and message
      const payloads = [
        { topic, messages: message } // No need to stringify message
      ];

      producer.send(payloads, (err, data) => {
        if (err) {
          console.error('Error sending message:', err);
        } else {
          console.log(`Message sent successfully to topic: ${topic}, data: ${JSON.stringify(data)}`);
        }
        rl.close();
      });
    });
  });
});

producer.on('error', function (err) {
  console.error('There was an error in the Kafka producer', err);
});
