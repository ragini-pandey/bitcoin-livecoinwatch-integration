import { Router, Request, Response } from 'express';

import { cryptoController } from './crypto.controller';

class CryptoRoutes {

  private router: Router = Router();

  get routes() {

    this.router.get(
      '/',
      (req: Request, res: Response) => {
        cryptoController.getAllAvailableCryptos(req, res);
      });

    return this.router;

  }

}

export const cryptoRoutes = new CryptoRoutes();
