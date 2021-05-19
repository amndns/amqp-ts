import { Connection, Exchange, Queue } from 'amqp-ts';
import { ExchangeType, ConsumerConfig, ConsumerCallback } from '../types';

/**
 * The main Consumer object, primarily used for registering and activating the
 * consumer. Note that a connection opens before the consumer starts and is
 * never closed unless explicitly interrupted.
 */
class RabbitConsumer {
  private callback: ConsumerCallback;
  private config: ConsumerConfig;
  private connection: Connection;
  private exchange: Exchange;
  private deadLetterExchange: Exchange;
  private queue: Queue;
  private deadLetterQueue: Queue;

  constructor(config: ConsumerConfig, callback: ConsumerCallback) {
    this.config = config;
    this.callback = callback;
  }

  public connect(): void {
    const { username, password, host, port } = this.config;
    this.connection = new Connection(
      `amqp://${username}:${password}@${host}:${port}`
    );
  }

  public declareExchange(): void {
    const { exchange, exchangeOptions = {} } = this.config;
    const {
      type = ExchangeType.TOPIC,
      durable = true,
      autoDelete = false,
      noCreate = false,
      ...options
    } = exchangeOptions;

    this.exchange = this.connection.declareExchange(exchange, type, {
      durable,
      autoDelete,
      noCreate,
      ...options,
    });
  }

  public declareQueue(): void {
    const {
      deadLetterOptions: { deadLetterExchange, deadLetterRoutingKey },
      queue,
      queueOptions = {},
    } = this.config;
    const {
      exclusive = false,
      durable = true,
      autoDelete = false,
      ...options
    } = queueOptions;

    if (this.config.deadLetterOptions) {
      options.deadLetterExchange = deadLetterExchange;
      options.arguments = {
        'x-dead-letter-routing-key': deadLetterRoutingKey,
      };
    }

    this.queue = this.connection.declareQueue(queue, {
      exclusive,
      durable,
      autoDelete,
      ...options,
    });
  }

  public declareDeadLetterExchange(): void {
    const {
      deadLetterOptions: { deadLetterExchange },
      exchangeOptions = {},
    } = this.config;
    const {
      type = ExchangeType.TOPIC,
      durable = true,
      autoDelete = false,
      noCreate = false,
      ...options
    } = exchangeOptions;

    this.deadLetterExchange = this.connection.declareExchange(
      deadLetterExchange,
      type,
      {
        durable,
        autoDelete,
        noCreate,
        ...options,
      }
    );
  }

  public declareDeadLetterQueue(): void {
    const {
      deadLetterOptions: { deadLetterExchange, deadLetterQueue, messageTtl },
      routingKey,
      queueOptions = {},
    } = this.config;
    const {
      exclusive = false,
      durable = true,
      autoDelete = false,
      ...options
    } = queueOptions;

    this.deadLetterQueue = this.connection.declareQueue(deadLetterQueue, {
      exclusive,
      durable,
      autoDelete,
      messageTtl,
      deadLetterExchange,
      arguments: {
        'x-dead-letter-routing-key': routingKey,
      },
      ...options,
    });
  }

  public declareResources(): void {
    this.declareExchange();
    this.declareQueue();
    this.queue.bind(this.exchange, this.config.routingKey);
    if (this.config.deadLetterOptions) {
      this.declareDeadLetterExchange();
      this.declareDeadLetterQueue();
      this.deadLetterQueue.bind(
        this.deadLetterExchange,
        this.config.deadLetterOptions.deadLetterRoutingKey
      );
    }
  }

  public run(): void {
    const { consumerOptions = {} } = this.config;
    const {
      noLocal = false,
      noAck = false,
      exclusive = false,
      ...options
    } = consumerOptions;

    if (!this.connection) {
      this.connect();
    }

    this.declareResources();
    this.queue.activateConsumer(this.callback, {
      noLocal,
      noAck,
      exclusive,
      ...options,
    });
  }
}

export default RabbitConsumer;
