import { Message, RabbitConsumer } from './index';

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
    deadLetterQueue: 'create_payment.dead.queue',
    deadLetterRoutingKey: 'create_payment.dead.key',
    messageTtl: 10000,
  },
};

const callback = (message: Message): void => {
  console.log(message.getContent());
  message.reject();
};

const notificationConsumer = new RabbitConsumer(config, callback);
notificationConsumer.run();
