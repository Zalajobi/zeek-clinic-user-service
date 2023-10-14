import ampq from 'amqplib';
// import {USER_SERVICE_EXCHANGE} from "../util/constants";

export const getRabbitMQDefaultConnection = async (queName: string) => {
  try {
    const connection = await ampq.connect(
      process.env.RABBITMQURL_DEV as string
    );
    const channel = await connection.createChannel();

    await channel.assertQueue(queName, { durable: false });
    // await channel.assertExchange(USER_SERVICE_EXCHANGE, 'fanout', {durable: false})

    return [connection, channel];
  } catch (error) {
    console.error('Error:', error);
  }
};
