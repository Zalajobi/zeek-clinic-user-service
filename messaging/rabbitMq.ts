import { getRabbitMQDefaultConnection } from '@lib/index';

// Convert Data to be sent to consumer event to String
export const emitNewEvent = async (que: string, jsonStringData: any) => {
  const [connection, channel] = <any>await getRabbitMQDefaultConnection(que);

  // const connection = await ampq.connect(process.env.RABBITMQURL_DEV as string);
  // const channel = await connection.createChannel();
  // await channel.assertQueue(que, { durable: false });

  channel.sendToQueue(que, Buffer.from(JSON.stringify(jsonStringData)));

  setTimeout(() => {
    connection.close();
  }, 500);
};
