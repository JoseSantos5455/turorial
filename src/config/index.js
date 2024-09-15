const publicRuntimeConfig = {
  BE_API_LOCAL: import.meta.env.VITE_BE_API,
  TEST_API_LOCAL: import.meta.env.VITE_MOCK_API,
  COURSE_API_TEST: import.meta.env.VITE_COURSE_API,
  COURSE_DETAIL_API_TEST: import.meta.env.VITE_COURSE_API_ID
  // create fake token here
};

export const { BE_API_LOCAL, TEST_API_LOCAL, COURSE_API_TEST, COURSE_DETAIL_API_TEST } = publicRuntimeConfig;
export default publicRuntimeConfig;
