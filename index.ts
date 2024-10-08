import 'module-alias/register';
import 'reflect-metadata';
import express = require('express');
import cors = require('cors');
import { AppDataSource } from './data-source';
import { SuperAdmin } from '@typeorm/entity/superAdmin';
import rootRouter from './routes';
import 'dotenv/config';
import { errorMiddleware } from '@middlewares/error';
import { authorizeRequest } from '@middlewares/auth';
import { mutableConfig } from '@util/config';
import cryptoClient from '@lib/crypto';

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://zeek-clinic-frontend.vercel.app',
    ],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Credentials',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Headers',
    ],
    exposedHeaders: ['X-Access-Token'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);
app.use('/', rootRouter);
app.use(authorizeRequest([]));
app.use(errorMiddleware);

mutableConfig.TYPEORM_LOGGING_START = false;
AppDataSource.initialize()
  .then(async () => {
    console.log('Initialising TypeORM...');
    // const superAdminRepository = superAdminRepo();

    console.log('Generating Superadmin...');
    const superAdmin1 = new SuperAdmin();
    superAdmin1.email = 'cduckett83@theglobeandmail.com';
    superAdmin1.username = 'gschaumaker2l';
    superAdmin1.first_name = 'Mathian';
    superAdmin1.last_name = 'Schaumaker';
    superAdmin1.phone_number = '+62-829-604-5743';
    superAdmin1.password = cryptoClient.generatePasswordHash('password123');

    const superAdmin2 = new SuperAdmin();
    superAdmin2.email = 'zalajobi@gmail.com';
    superAdmin2.username = 'zalajobi';
    superAdmin2.first_name = 'Zhikrullah';
    superAdmin2.last_name = 'IGBALAJOBI';
    superAdmin2.phone_number = '+352-346-220-5311';
    superAdmin2.password = cryptoClient.generatePasswordHash('password123');

    console.log('Superadmin users Generated Successfully');
    mutableConfig.TYPEORM_LOGGING_START = true;

    // await superAdminRepository.save(superAdmin1)
    // await superAdminRepository.save(superAdmin2)
  })
  .catch((error) => console.log(error));

app.listen(process.env.PROJECT_PORT, () => {
  console.log(`Example app listening on port ${process.env.PROJECT_PORT}`);
});
