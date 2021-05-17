import { Message } from 'amqp-ts';
import { Expose } from 'class-transformer';
import { ContentType } from '../../../src/types';
import { consumerMessage, producerMessage } from '../../../src/utils';

class SampleMessage {
  @Expose({ name: 'string_data', toPlainOnly: true })
  public stringData: string;
}

describe('utils/utils', () => {
  describe('consumerMessage', () => {
    it('Should transform the RMQ consumer message based on transformer decorators', async (done) => {
      const message = new Message(
        JSON.stringify({
          string_data: 'test',
        }),
        { contentType: ContentType.JSON }
      );

      const transformedMessage = await consumerMessage(SampleMessage, message);
      const expectedMessage = new SampleMessage();
      expectedMessage.stringData = 'test';

      expect(transformedMessage).toStrictEqual(expectedMessage);
      done();
    });
  });

  describe('producerMessage', () => {
    it('Should transform the RMQ producer message based on transformer decorators', async (done) => {
      const transformedMessage = await producerMessage(SampleMessage, {
        stringData: 'test',
      });
      const expectedMessage = {
        string_data: 'test',
      };

      expect(transformedMessage).toStrictEqual(expectedMessage);
      done();
    });
  });
});
