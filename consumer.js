const { kafka, client } = require('./index.js');
const { createInterface } = require('readline');

// Initialize Kafka consumer
const Consumer = kafka.Consumer;

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter topic: ', (topic) => {
  const consumer = new Consumer(client, [{ topic, offset: 0, partition: 0 }], {
    autoCommit: false
  });

  consumer.on('message', function (message) {
    console.log('Topic:', message.topic);
    console.log('Value', message.value);
    console.log('Offset', message.offset);

  });

  consumer.on('error', function (err) {
    console.error('Error in Kafka consumer:', err.message);
  });

  rl.close();
});
