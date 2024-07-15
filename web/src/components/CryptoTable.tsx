import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Table from 'react-bootstrap/Table';
import { RootState } from '../store/store';
import { setData } from '../store/tableSlice';
import ModalComponent from './CryptoChangeModal';
import { setShowModal } from '@/store/modalSlice';
import { API_BASE_URL, TABLE_PAGE_SIZE } from '@/constants';

const containerStyle = {
  marginTop: '50px',
  padding: '20px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '100%',
  overflowX: 'auto',
};

const headingStyle = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  color: '#343a40',
  marginBottom: '30px',
};

const tableStyle = {
  width: '100%',
  textAlign: 'center',
};

const tableHeaderStyle = {
  backgroundColor: '#343a40',
  color: '#fff',
};

const tableRowStyle = {
  transition: 'background-color 0.3s ease',
};

const tableRowHoverStyle = {
  backgroundColor: '#f1f1f1',
};

const tableDataStyle = {
  verticalAlign: 'middle',
  padding: '5px',
  fontSize: '1rem',
};

const buttonStyle = {
  padding: '10px 10px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};

const buttonHoverStyle = {
  backgroundColor: '#0056b3',
};

const TableComponent: React.FC = () => {
  const dispatch = useDispatch();
  const tableData = useSelector((state: RootState) => state.table.data);
  const selectedCrypto = useSelector((state: RootState) => state.modal.selectedCrypto);

  const handleOpenModal = () => {
    dispatch(setShowModal(true));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          API_BASE_URL + `crypto-prices?cryptoName=${selectedCrypto}&limit=${TABLE_PAGE_SIZE}`
        );
        const data = await response.json();
        dispatch(setData(data));
      } catch (error) {
        console.error('Error fetching table data:', error);
      }
    };
    fetchData();
  }, [dispatch, selectedCrypto]);

  return (
    <div className='container' style={containerStyle}>
      <h1 className='text-center' style={headingStyle}>
        Real-Time Cryptocurrency Prices for <span style={{ backgroundColor: "gray" }}>{selectedCrypto}</span>
      </h1>

      <Table striped bordered hover responsive style={tableStyle}>
        <thead style={tableHeaderStyle}>
          <tr>
            <th>#</th>
            <th>Price ($)</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, index) => (
            <tr
              key={item.id}
              style={tableRowStyle}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = tableRowHoverStyle.backgroundColor)
              }
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
            >
              <td style={tableDataStyle}>{index + 1}</td>
              <td style={tableDataStyle}>{item.rate}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ModalComponent />
    </div>
  );
};

export default TableComponent;
