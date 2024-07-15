import { Response } from 'express';

import { CONSTANTS } from '@constants';

export const handleException = (methodName: string, exception: Error, res: Response, throwError = true) => {

  console.log(`Exception in method: ${methodName}:`, exception.message);

  if (throwError) {
    res.status(CONSTANTS.STATUS.INTERNAL_SERVER_ERROR).json({ message: exception.message });
  }
};
