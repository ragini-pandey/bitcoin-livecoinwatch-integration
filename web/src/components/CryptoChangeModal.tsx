import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { RootState } from '../store/store';
import { setCryptoList, setSelectedCrypto, setShowModal } from '../store/modalSlice';
import { API_BASE_URL } from '@/constants';

const ModalComponent: React.FC = () => {
  const dispatch = useDispatch();
  const showModal = useSelector((state: RootState) => state.modal.showModal);
  const cryptoData = useSelector((state: RootState) => state.modal.cryptoList);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_BASE_URL + 'cryptos');
        const data = await response.json();
        dispatch(setCryptoList(data));
      } catch (error) {
        console.error('Error fetching table data:', error);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleClose = () => {
    dispatch(setShowModal(false));
  };

  const handleCryptoClick = (cryptoName: string) => {
    dispatch(setSelectedCrypto(cryptoName));
    handleClose();
  };

  const handleOpenModal = () => {
    dispatch(setShowModal(true));
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
      >
        Change Crypto
      </button>

      <Modal show={showModal} onHide={handleClose} centered>
        {/* <Modal.Header
          closeButton
          style={{ backgroundColor: '#007bff', color: '#fff', borderBottom: 'none' }}
        >
          <Modal.Title style={{ fontWeight: 'bold' }}>Choose a Crypto</Modal.Title>
        </Modal.Header> */}
        <Modal.Body style={{ padding: '20px' }}>
          {cryptoData?.map((crypto) => (
            <button
              key={crypto.name}
              onClick={() => handleCryptoClick(crypto.name)}
              style={{
                display: 'block',
                width: '100%',
                marginBottom: '10px',
                padding: '12px',
                borderRadius: '5px',
                cursor: 'pointer',
                backgroundColor: '#17a2b8',
                color: '#fff',
                border: 'none',
                textAlign: 'left',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.3s ease, transform 0.1s ease-out',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#138496')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#17a2b8')}
            >
              {crypto.name}
            </button>
          ))}
        </Modal.Body>
        {/* <Modal.Footer style={{ borderTop: 'none', padding: '15px', justifyContent: 'flex-end' }}>
          <button
            onClick={handleClose}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
          >
            Close
          </button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
};

export default ModalComponent;
