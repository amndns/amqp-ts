import { Message } from 'amqp-ts';
import {
  ClassConstructor,
  classToPlain,
  plainToClass,
} from 'class-transformer';
import { validate } from 'class-validator';

/**
 * Converts a consumer message into a request class instance object. This also
 * validates the request object.
 */
export async function consumerMessage<T>(
  cls: ClassConstructor<unknown>,
  message: Message
): Promise<T> {
  const transformedRequest = plainToClass(cls, message.getContent());

  const errors = await validate(transformedRequest as any);
  if (errors.length > 1) {
    throw new Error(`Invalid consumer message request shape.`);
  }

  return transformedRequest as T;
}

/**
 * Converts a producer message into a request JS object. This also validates
 * the request object.
 */
export async function producerMessage<T>(
  cls: ClassConstructor<unknown>,
  request: T
): Promise<T> {
  const transformedRequest = plainToClass(cls, request);

  const errors = await validate(transformedRequest as any);
  if (errors.length > 1) {
    throw new Error(`Invalid producer message request shape.`);
  }

  return classToPlain(transformedRequest) as T;
}
