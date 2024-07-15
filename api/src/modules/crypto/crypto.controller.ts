import { Request, Response } from 'express';

import { CONSTANTS } from '@constants';
import { handleException } from '../../config/error-handler';
import { ICoinListResponse, ICrypto } from './crypto.interfaces';
import { cryptoModel } from '@models/index';

class CryptoController {
  constructor() {}

  async setCryptoSeedData(response: ICoinListResponse[]) {
    try {
      return await Promise.all(
        response.map(async (coin) => {
          await cryptoModel.create({
            name: coin.code,
            rate: coin.rate,
          });
        })
      );
    } catch (e) {
      console.error('Error fetching crypto seed data:', e);
      throw e;
    }
  }

  async getAllAvailableCryptos(req: Request, res: Response) {
    try {
      const cryptos: ICrypto[] = await cryptoModel.find({});
      res.status(CONSTANTS.STATUS.OK).json(cryptos);
    } catch (e) {
      handleException('getAllAvailableCryptos', e, res);
    }
  }
}

export const cryptoController = new CryptoController();
