
/**
 * https://www.conduktor.io/kafka/how-to-install-apache-kafka-on-mac-with-homebrew/
 *  /opt/homebrew/bin/zookeeper-server-start /opt/homebrew/etc/zookeeper/zoo.cfg
 * /opt/homebrew/bin/kafka-server-start /opt/homebrew/etc/kafka/server.properties  

*/const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const { Kafka, Partitioners } = require('kafkajs');

const app = new Koa();
const router = new Router();
app.use(bodyParser());

const kafka = new Kafka({
  clientId: 'chat-app',
  brokers: ['localhost:9092'], // Adjust this to your Kafka broker address
});

let producer; // Initialize producer outside the loop for reusability

async function connectToKafka() {
  try {
    producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
    await producer.connect(); // Connect initially
    console.log('Connected to Kafka broker.');
  } catch (error) {
    console.error('Error connecting to Kafka:', error);
    // Implement reconnection logic with exponential backoff (see below)
  }
}

// Routes
router.post('/send-message', async (ctx) => {
  // Ensure Kafka connection before sending messages
  if (!producer === false) {
    console.error('Producer not connected to Kafka. Attempting reconnection...');
    await connectToKafka();
  }

  const { room, message } = ctx.request.body;
  try {
    await producer.send({
      topic: room,
      messages: [
        { value: JSON.stringify({ message }) }
      ]
    });
    ctx.body = { success: true, message: 'Message sent successfully' };
  } catch (error) {
    console.error('Error sending message:', error);
    ctx.status = 500;
    ctx.body = { success: false, message: 'Failed to send message' };
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

// Function to check if Kafka is running (optional, can be removed)
async function checkKafkaRunning() {
  try {
    // Connect to Kafka broker
    const admin = kafka.admin();
    await admin.connect();

    console.log('Kafka is running and reachable.');

    // Disconnect from Kafka broker
    await admin.disconnect();
  } catch (error) {
    console.error('Error connecting to Kafka:', error.message);
  }
}

// Improved reconnection logic with exponential backoff
let retries = 0;
const maxRetries = 10; // Adjust as needed
const baseBackoff = 1000; // Base wait time in milliseconds

async function reconnectWithBackoff() {
  if (retries >= maxRetries) {
    console.error('Failed to connect to Kafka after retries. Exiting...');
    process.exit(1); // Exit the application gracefully (optional)
  }

  const backoff = Math.pow(2, retries) * baseBackoff;
  console.log(`Retrying Kafka connection in ${backoff / 1000} seconds...`);
  await new Promise(resolve => setTimeout(resolve, backoff));
  retries++;

  await connectToKafka();
}

(async () => {
  await connectToKafka(); // Initial connection attempt

  // Handle SIGINT (Ctrl+C) for graceful shutdown
  process.on('SIGINT', async () => {
    console.log('Received SIGINT. Disconnecting from Kafka...');
    if (producer) {
      await producer.disconnect();
    }
    process.exit(0); // Exit cleanly
  });
})();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Call the function to check if Kafka is running (optional)
// checkKafkaRunning();
