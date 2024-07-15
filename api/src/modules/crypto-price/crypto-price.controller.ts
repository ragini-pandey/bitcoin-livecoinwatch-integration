import { Request, Response } from 'express';
import axios from 'axios';

import { CONSTANTS } from '@constants';
import { handleException } from '../../config/error-handler';
import { CryptoDetails } from './crypto-price.interfaces';
import { cryptoModel, cryptoPriceModel } from '@models/index';
import { ICryptoPrice } from '@modules/crypto/crypto.interfaces';

class CryptoPriceController {
  constructor() {}

  async getLatestCryptoPrices(req: Request, res: Response) {
    try {
      const cryptoName = req.query.cryptoName;
      const limit = req.query.limit;

      const crypto = await cryptoModel.findOne({ name: cryptoName as string});

      const cryptoPrices: ICryptoPrice[] = await cryptoPriceModel
        .find({ cryptoId: crypto.id })
        .sort({ createdAt: -1 })
        .limit(Number(limit));

      res.status(CONSTANTS.STATUS.OK).json(cryptoPrices);
    } catch (e) {
      handleException('getLatestCryptoPrices', e, res);
    }
  }

  async saveLatestCryptoPrices() {
    try {
      const allCryptos = await cryptoModel.find({});

      return await Promise.all(
        allCryptos.map(async (crypto) => {
          const response = await axios.post(
            CONSTANTS.LIVE_COIN_WATCH_API_BASE_URL + 'coins/single',
            {
              currency: CONSTANTS.CURRENCY,
              code: crypto.name,
              meta: true,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.LIVE_COIN_WATCH_API_KEY,
              },
            }
          );

          const cryptoDetails: CryptoDetails = response.data;

          await cryptoPriceModel.create({
            cryptoId: crypto.id,
            rate: cryptoDetails.rate,
          });
        })
      );
    } catch (e) {
      console.error('Error fetching crypto seed data:', e);
      throw e;
    }
  }
}

export const cryptoPriceController = new CryptoPriceController();
