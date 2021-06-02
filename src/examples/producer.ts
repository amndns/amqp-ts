import { ContentType, RabbitProducer } from '../index';

/**
 * This creates a sample producer with declared main exchange. This simply
 * publishes a message to an exhange using a routing key.
 */
const config = {
  host: 'localhost',
  port: 5672,
  username: 'admin',
  password: 'admin',
  exchange: 'notifications',
};

const notificationProducer = new RabbitProducer(config);

notificationProducer.publish(
  {
    foo: 'bar',
  },
  'create_payment.key',
  {
    contentType: ContentType.JSON,
    persistent: true,
    timestamp: Math.floor(Date.now() / 1000),
  }
);
