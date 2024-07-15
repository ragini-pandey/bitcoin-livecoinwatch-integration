import { connect, connection, set, Error, ConnectOptions } from 'mongoose';

import { handleException } from './../error-handler';

const connectionOptions: ConnectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};
export class MongoDB {

  constructor(dbUrl: string) {

    connect(dbUrl, connectionOptions);
    set('useCreateIndex', true);
    set('debug', false);

    connection.on('error', (err: Error) => {
      handleException('MongoDB error', new Error(`Database connection error occurred :( ${err}`), null, false);
      process.exit(1);
    });

    connection.once('open', () => {
      console.log(`Successfully connected to database at ${dbUrl}`);
    });
  }
}
