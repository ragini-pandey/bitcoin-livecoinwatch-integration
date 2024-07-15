import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ICrypto } from '../../../api/src/modules/crypto/crypto.interfaces';

interface ModalState {
  showModal: boolean;
  cryptoList: ICrypto[];
  selectedCrypto: string;
}

const initialState: ModalState = {
  showModal: false,
  cryptoList: [],
  selectedCrypto: "BTC"
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setShowModal(state, action: PayloadAction<boolean>) {
      state.showModal = action.payload;
    },
    setCryptoList(state, action: PayloadAction<ICrypto[]>) {
      state.cryptoList = action.payload;
    },
    setSelectedCrypto(state, action: PayloadAction<string>) {
      state.selectedCrypto = action.payload;
    },
  },
});

export const { setShowModal, setCryptoList, setSelectedCrypto } = modalSlice.actions;

export default modalSlice.reducer;
