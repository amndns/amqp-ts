import { Connection, Exchange, Queue } from 'amqp-ts';
import {
  AdditionalResourcesConfig,
  ConsumerConfig,
  ConsumerCallback,
  ExchangeOptions,
  ExchangeType,
  Resources,
  DeadLetterOptions,
} from '../types';

/**
 * The main Consumer object, primarily used for registering and activating the
 * consumer. Note that a connection opens before the consumer starts and is
 * never closed unless explicitly interrupted.
 */
class RabbitConsumer {
  private callback: ConsumerCallback;
  private config: ConsumerConfig;
  private connection: Connection;

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

  public declareExchange(
    exchange: string,
    exchangeOptions: ExchangeOptions
  ): Exchange {
    const {
      type = ExchangeType.TOPIC,
      durable = true,
      autoDelete = false,
      noCreate = false,
      ...options
    } = exchangeOptions;

    return this.connection.declareExchange(exchange, type, {
      durable,
      autoDelete,
      noCreate,
      ...options,
    });
  }

  public declareQueue(
    queue: string,
    queueOptions: Queue.DeclarationOptions,
    deadLetterOptions?: DeadLetterOptions
  ): Queue {
    const {
      exclusive = false,
      durable = true,
      autoDelete = false,
      ...options
    } = queueOptions;

    if (deadLetterOptions) {
      const { deadLetterExchange, deadLetterRoutingKey } = deadLetterOptions;

      options.deadLetterExchange = deadLetterExchange;
      options.arguments = {
        'x-dead-letter-routing-key': deadLetterRoutingKey,
      };
    }

    return this.connection.declareQueue(queue, {
      exclusive,
      durable,
      autoDelete,
      ...options,
    });
  }

  public declareResources(
    config: ConsumerConfig | AdditionalResourcesConfig
  ): Resources {
    const {
      exchange,
      exchangeOptions = {},
      queue,
      queueOptions = {},
      routingKey,
      deadLetterOptions,
    } = config;

    const exchangeResource = this.declareExchange(exchange, exchangeOptions);
    const queueResource = this.declareQueue(
      queue,
      queueOptions,
      deadLetterOptions
    );
    queueResource.bind(exchangeResource, routingKey);

    return {
      exchangeResource,
      queueResource,
    };
  }

  public declareAdditionalResources(
    additionalResources: AdditionalResourcesConfig
  ): void {
    if (!this.connection) {
      this.connect();
    }

    this.declareResources(additionalResources);
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

    const { queueResource } = this.declareResources(this.config);
    queueResource.activateConsumer(this.callback, {
      noLocal,
      noAck,
      exclusive,
      ...options,
    });
  }
}

export default RabbitConsumer;
