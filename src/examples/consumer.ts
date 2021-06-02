import { Message, RabbitConsumer } from '../index';

/**
 * This creates a sample consumer with declared main queue and exchange, along
 * with an additionally defined dead-letter queue. The dead-letter queue lives
 * within the same main exchange. The dead-letter queue also has a message TTL
 * that, when expired, routes the message back to the main queue.
 */
const config = {
  host: 'localhost',
  port: 5672,
  username: 'admin',
  password: 'admin',
  exchange: 'notifications',
  queue: 'create_payment.queue',
  routingKey: 'create_payment.key',
  deadLetterOptions: {
    deadLetterExchange: 'notifications',
    deadLetterRoutingKey: 'create_payment.dead.key',
  },
};

const callback = (message: Message): void => {
  console.log(message.getContent());
  message.reject();
};

const notificationConsumer = new RabbitConsumer(config, callback);

notificationConsumer.declareAdditionalResources({
  exchange: 'notifications',
  queue: 'create_payment.dead.queue',
  queueOptions: {
    messageTtl: 5000,
  },
  routingKey: 'create_payment.dead.key',
  deadLetterOptions: {
    deadLetterExchange: 'notifications',
    deadLetterRoutingKey: 'create_payment.key',
  },
});

notificationConsumer.run();
