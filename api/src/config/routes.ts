import { Request, Response, Router } from 'express';

import { CONSTANTS } from '@constants';
import { cryptoRoutes } from '@modules/crypto/crypto.routes';
import { cryptoPricesRoutes } from '@modules/crypto-price/crypto-price.routes';

export class BackendRoutes {

  constructor(router: Router) {
    this.init(router);
    this.initModuleRoutes(router);
    this.init404Routes(router);
  }
  private init(router: Router) {
    router.get('/', (req: Request, res: Response) => {
      res.json({ message: CONSTANTS.MESSAGES.API_WORKING });
    });
  }

  private initModuleRoutes(router: Router) {
    router.use('/cryptos', cryptoRoutes.routes);
    router.use('/crypto-prices', cryptoPricesRoutes.routes);
  }

  private init404Routes(router: Router) {
    router.use((req: Request, res: Response) => {
      res.status(CONSTANTS.STATUS.NOT_FOUND).json({ message: CONSTANTS.MESSAGES.ENDPOINT_NOT_FOUND });
    });
  }

}
