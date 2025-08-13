export const ApiConstant = {
  auth: {
    login: '/login',
    register: '/signup',
    logout: '/logout',
    verify: '/users/confirm',
  },
  category: {
    getCategories: '/categories',
  },
  address: {
    getAddresses: '/addresses',
    createAddress: '/addresses',
    updateAddress: (id: number) => `/addresses/${id}`,
    deleteAddress: (id: number) => `/addresses/${id}`,
    getAddressById: (id: number) => `/addresses/${id}`,
  },
};


