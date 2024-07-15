import { model, Schema } from 'mongoose';

import { CONSTANTS } from '@constants';
import { ICrypto } from '@modules/crypto/crypto.interfaces';

const cryptoSchema: Schema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      trim: true,
      required: true,
    },
    rate: {
      type: Schema.Types.String,
      trim: true,
      required: true,
    }
  },
  {
    collection: CONSTANTS.DATABASE_COLLECTIONS.CRYPTO,
    timestamps: {
      createdAt: CONSTANTS.CREATED_AT,
      updatedAt: CONSTANTS.UPDATED_AT,
    },
  },
);

export const cryptoModel = model<ICrypto>('cryptoModel', cryptoSchema);
