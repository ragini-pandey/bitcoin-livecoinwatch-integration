import { model, Schema } from 'mongoose';

import { CONSTANTS } from '@constants';
import { cryptoModel } from './crypto.model';
import { ICryptoPrice } from '@modules/crypto/crypto.interfaces';

const cryptoPriceSchema: Schema = new Schema(
  {
    cryptoId: {
      type: Schema.Types.ObjectId,
      ref: cryptoModel,
      required: true,
    },
    rate: {
      type: Schema.Types.Decimal128,
      required: true,
      get: getCosts,
    },
  },
  {
    collection: CONSTANTS.DATABASE_COLLECTIONS.CRYPTO_PRICES,
    timestamps: {
      createdAt: CONSTANTS.CREATED_AT,
      updatedAt: CONSTANTS.UPDATED_AT,
    },
    toJSON: {
      getters: true,
    },
  }
);

function getCosts(value: string) {
    if (typeof value !== 'undefined') {
       return parseFloat(value.toString());
    }
    return value;
};

export const cryptoPriceModel = model<ICryptoPrice>('cryptoPriceModel', cryptoPriceSchema);
