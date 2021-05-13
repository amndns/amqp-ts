import { Container } from 'typedi';
import { ProducerConfig } from '../types';
import RabbitProducer from './rabbit-producer.class';

/**
 * The main Producer decorator used for injecting the `RabbitProducer` object
 * into class constructors.
 */
const Producer = (config: ProducerConfig): ParameterDecorator => (
  object: any,
  propertyKey,
  index
): any => {
  const producer = new RabbitProducer(config);
  const propertyName = propertyKey ? propertyKey.toString() : '';
  Container.registerHandler({
    object,
    propertyName,
    index,
    value: () => producer,
  });
};

export default Producer;
