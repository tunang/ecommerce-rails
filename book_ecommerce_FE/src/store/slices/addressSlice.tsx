import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Address } from '@/types/address.type';

interface AddressState {
  addresses: Address[];
  currentAddress: Address | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AddressState = {
  addresses: [],
  currentAddress: null,
  isLoading: false,
  error: null,
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    // Fetch addresses actions
    fetchAddressesRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchAddressesSuccess: (state, action: PayloadAction<{ addresses: Address[] }>) => {
      state.isLoading = false;
      state.addresses = action.payload.addresses;
      state.error = null;
    },
    fetchAddressesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch single address actions
    fetchAddressByIdRequest: (state, _action: PayloadAction<number>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchAddressByIdSuccess: (state, action: PayloadAction<Address>) => {
      state.isLoading = false;
      state.currentAddress = action.payload;
      state.error = null;
    },
    fetchAddressByIdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Create address actions
    createAddressRequest: (state, _action: PayloadAction<{
      first_name: string;
      last_name: string;
      address_line_1: string;
      address_line_2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
      phone: string;
      is_default: boolean;
    }>) => {
      state.isLoading = true;
      state.error = null;
    },
    createAddressSuccess: (state, action: PayloadAction<Address>) => {
      state.isLoading = false;
      state.addresses.unshift(action.payload);
      state.error = null;
    },
    createAddressFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update address actions
    updateAddressRequest: (state, _action: PayloadAction<{ 
      id: number; 
      address: {
        first_name: string;
        last_name: string;
        address_line_1: string;
        address_line_2?: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
        phone: string;
        is_default: boolean;
      } 
    }>) => {
      state.isLoading = true;
      state.error = null;
    },
    updateAddressSuccess: (state, action: PayloadAction<Address>) => {
      state.isLoading = false;
      const index = state.addresses.findIndex(address => address.id === action.payload.id);
      if (index !== -1) {
        state.addresses[index] = action.payload;
      }
      if (state.currentAddress?.id === action.payload.id) {
        state.currentAddress = action.payload;
      }
      state.error = null;
    },
    updateAddressFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Delete address actions
    deleteAddressRequest: (state, _action: PayloadAction<{ addressId: number }>) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteAddressSuccess: (state, action: PayloadAction<number>) => {
      state.isLoading = false;
      state.addresses = state.addresses.filter(address => address.id !== action.payload);
      if (state.currentAddress?.id === action.payload) {
        state.currentAddress = null;
      }
      state.error = null;
    },
    deleteAddressFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear current address
    clearCurrentAddress: (state) => {
      state.currentAddress = null;
    },
  },
});

export const {
  fetchAddressesRequest,
  fetchAddressesSuccess,
  fetchAddressesFailure,
  fetchAddressByIdRequest,
  fetchAddressByIdSuccess,
  fetchAddressByIdFailure,
  createAddressRequest,
  createAddressSuccess,
  createAddressFailure,
  updateAddressRequest,
  updateAddressSuccess,
  updateAddressFailure,
  deleteAddressRequest,
  deleteAddressSuccess,
  deleteAddressFailure,
  clearError,
  clearCurrentAddress,
} = addressSlice.actions;

export default addressSlice.reducer;