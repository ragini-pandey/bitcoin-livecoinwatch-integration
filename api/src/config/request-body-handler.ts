import { NextFunction, Request, Response } from 'express';

import { CONSTANTS } from '@constants';

export function requestBodyHandler(error: Error | any, req: Request, res: Response, next: NextFunction) {
  if (error.status === CONSTANTS.STATUS.BAD_REQUEST && error instanceof SyntaxError) {
    return res.status(CONSTANTS.STATUS.BAD_REQUEST).json({
      message: CONSTANTS.MESSAGES.ERROR.INVALID_JSON,
      error,
    });
  }
  if (error.type === 'entity.too.large') {
    return res.status(CONSTANTS.STATUS.BAD_REQUEST).json({
      message: CONSTANTS.MESSAGES.ERROR.PAYLOAD_SIZE_EXCEEDED,
      error,
    });
  }
  next();

}
