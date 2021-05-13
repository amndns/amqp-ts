import { Connection, Exchange, Message } from 'amqp-ts';
import { ExchangeType, MessageOptions, ProducerConfig } from '../types';

/**
 * The main Producer object, primarily used for publishing messages to
 * exchanges. Note that a connection is created before the publish event
 * and then closed after the event resolves.
 */
class RabbitProducer {
  readonly CLOSE_CONNECTION_TIMEOUT = 250; // in milliseconds

  private config: ProducerConfig;
  private connection: Connection;
  private exchange: Exchange;

  constructor(config: ProducerConfig) {
    this.config = config;
  }

  public connect(): void {
    const { username, password, host, port } = this.config;
    this.connection = new Connection(
      `amqp://${username}:${password}@${host}:${port}`
    );
  }

  public declareExchange(): void {
    const { exchange, exchangeOptions = {} } = this.config;
    const { type = ExchangeType.TOPIC, ...options } = exchangeOptions;

    this.exchange = this.connection.declareExchange(exchange, type, options);
  }

  public async publish<T>(content: T, options: MessageOptions): Promise<void> {
    if (!this.connection) {
      this.connect();
    }

    this.declareExchange();

    this.connection.completeConfiguration().then(() => {
      const message = new Message(JSON.stringify(content), options);
      this.exchange.send(message, this.config.routingKey);
      setTimeout(() => {
        this.connection.close();
      }, this.CLOSE_CONNECTION_TIMEOUT);
    });
  }
}

export default RabbitProducer;
