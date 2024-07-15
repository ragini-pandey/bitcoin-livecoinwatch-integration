import {
  json,
  urlencoded,
  Application,
  NextFunction,
  Request,
  Response,
  ErrorRequestHandler,
  RequestHandler,
} from 'express';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import cron from 'node-cron';

import { CONSTANTS } from '@constants';
import { MongoDB } from '../database/mongoose.connection';
import { handleException } from './../error-handler';
import { requestBodyHandler } from '.././request-body-handler';
import { cryptoPriceController } from '@modules/crypto-price/crypto-price.controller';

export class Middlewares {
  constructor(app: Application) {
    this.init(app);
  }

  private init(app: Application) {
    this.initHelmet(app);

    this.initLogger(app);

    this.initBodyParser(app);

    this.connectToDatabase();

    this.setupCronjobs();

    this.setupAccessControlHeaders(app);

    this.handleUncaughtErrors();

    this.initCompression(app);
  }

  initHelmet(app: Application) {
    app.use(helmet());
  }

  initLogger(app: Application) {
    app.use(morgan('dev'));
  }

  initBodyParser(app: Application) {
    app.use(json({ limit: CONSTANTS.BODY_PARSER_LIMIT }), requestBodyHandler);
    app.use(urlencoded({ limit: CONSTANTS.BODY_PARSER_LIMIT, extended: true }));
  }

  connectToDatabase() {
    new MongoDB(process.env.MONGODB_URL);
  }

  setupCronjobs() {
    cron.schedule('0 */10 * * * *', async () => {
      console.log('saveLatestCryptoPrices job triggered');
      await cryptoPriceController.saveLatestCryptoPrices();
    });
  }

  setupAccessControlHeaders(app: Application) {
    app.use((req: Request, res: Response, next: NextFunction) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      next();
    });
  }

  handleUncaughtErrors() {
    process.on('uncaughtException', (error: Error) => {
      handleException(
        'handleUncaughtErrors',
        new Error(`Server crashed due to this uncaughtException: ${error.message}`),
        null,
        false
      );
      process.exit(1);
    });

    process.on('unhandledRejection', (error: Error) => {
      handleException(
        'unhandledRejection',
        new Error(`Server crashed due to this unhandledRejection: ${error.message}`),
        null,
        false
      );
      process.exit(1);
    });
  }

  initCompression(app: Application) {
    app.use(compression());
  }
}
