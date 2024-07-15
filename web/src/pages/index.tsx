import { Provider } from 'react-redux';

import { store } from '../store/store';
import TableComponent from '@/components/CryptoTable';

export default function Home() {

  return (
    <div className='p-4'>
      <Provider store={store}>
        <TableComponent />
      </Provider>
    </div>
  );
}
