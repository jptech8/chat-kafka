
const kafka = require('kafka-node');
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
module.exports ={
  kafka,client
}