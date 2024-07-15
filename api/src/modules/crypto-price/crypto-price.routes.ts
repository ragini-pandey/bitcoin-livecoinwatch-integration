import { Router, Request, Response } from 'express';

import { cryptoPriceController } from './crypto-price.controller';

class CryptoPriceRoutes {

  private router: Router = Router();

  get routes() {

    this.router.get(
      '/',
      (req: Request, res: Response) => {
        cryptoPriceController.getLatestCryptoPrices(req, res);
      });

    return this.router;

  }

}

export const cryptoPricesRoutes = new CryptoPriceRoutes();
