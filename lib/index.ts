import ampq from 'amqplib';

export const getRabbitMQDefaultConnection = async (queName: string) => {
  const connection = await ampq.connect(process.env.RABBITMQURL_DEV);
  const channel = await connection.createChannel();
  await channel.assertQueue(queName, { durable: false });

  return [connection, channel];
};
