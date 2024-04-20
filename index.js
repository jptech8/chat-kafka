
const { Kafka } = require('kafkajs');
const { createInterface } = require('readline');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
});

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

module.exports ={
  kafka,rl
}