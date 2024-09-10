const publicRuntimeConfig = {
  BE_API_LOCAL: import.meta.env.VITE_BE_API,
  TEST_API_LOCAL: import.meta.env.VITE_MOCK_API,
  // create fake token here
};

export const { BE_API_LOCAL,TEST_API_LOCAL } = publicRuntimeConfig;
export default publicRuntimeConfig;
