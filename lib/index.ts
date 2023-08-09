import ampq from 'amqplib';

export const getRabbitMQDefaultConnection = async (queName: string) => {
  try {
    const connection = await ampq.connect(
      process.env.RABBITMQURL_DEV as string
    );
    const channel = await connection.createChannel();

    await channel.assertQueue(queName, { durable: false });

    return [connection, channel];
  } catch (error) {
    console.error('Error:', error);
  }
};
