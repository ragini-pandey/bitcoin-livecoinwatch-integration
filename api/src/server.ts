import express, { Application, Router } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

import 'module-alias/register';

import { Middlewares } from './config/middlewares/app.middlewares';
import { BackendRoutes } from './config/routes';
import { CONSTANTS } from '@constants';
import { cryptoController } from '@modules/crypto/crypto.controller';
import { cryptoModel } from '@models/crypto.model';
import { ICrypto } from '@modules/crypto/crypto.interfaces';

class Server {
  public app: Application = express();
  public router: Router = Router();

  constructor() {
    dotenv.config({ path: __dirname + '/.env' });

    this.configMiddleware();
    this.getCryptoSeedData();
    this.configRoutes();
    this.startServer();
  }

  private configMiddleware() {
    new Middlewares(this.app);
  }

  private async getCryptoSeedData() {
    try {
      const cryptos: ICrypto[] = await cryptoModel.find({});

      // Seed data is already set
      if (cryptos.length) return;

      const response = await axios.post(
        CONSTANTS.LIVE_COIN_WATCH_API_BASE_URL + 'coins/list',
        {
          currency: CONSTANTS.CURRENCY,
          sort: 'rank',
          order: 'ascending',
          offset: 0,
          limit: 5,
          meta: false,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.LIVE_COIN_WATCH_API_KEY,
          },
        }
      );
      await cryptoController.setCryptoSeedData(response.data);
    } catch (error) {
      console.error('Error fetching crypto seed data:', error);
      throw error;
    }
  }

  private configRoutes() {
    this.app.use('/api', this.router);
    new BackendRoutes(this.router);
  }

  private startServer() {
    this.app.set('port', process.env.PORT_VALUE);

    this.app.listen(this.app.get('port'), () => {
      console.log(`${process.env.ENVIRONMENT_NAME} server started on port ${this.app.get('port')}`);
    });
  }
}

new Server();
