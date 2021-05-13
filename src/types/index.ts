import { Exchange, Message, Queue } from 'amqp-ts';

export enum ContentType {
  PLAIN = 'text/plain',
  JSON = 'application/json',
  BINARY = 'application/binary',
}

export enum ExchangeType {
  DIRECT = 'direct',
  FANOUT = 'fanout',
  HEADERS = 'headers',
  TOPIC = 'topic',
}

export interface ExchangeOptions extends Exchange.DeclarationOptions {
  type?: ExchangeType;
}

export interface BaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  vhost?: string;
}

export interface ConsumerConfig extends BaseConfig {
  exchange: string;
  queue: string;
  routingKey: string;
  consumerOptions?: Queue.ActivateConsumerOptions;
  exchangeOptions?: ExchangeOptions;
  queueOptions?: Queue.DeclarationOptions;
}

export interface ProducerConfig extends BaseConfig {
  exchange: string;
  routingKey: string;
  exchangeOptions?: ExchangeOptions;
}

export interface MessageOptions {
  contentType: ContentType;
  persistent: boolean;
  timestamp: number;
  priority?: number;
}

export type ConsumerCallback = (message: Message) => void;
export { Connection, Exchange, Message, Queue } from 'amqp-ts';
