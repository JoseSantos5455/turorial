import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BE_API_LOCAL } from "../config";
///change APi URL 


export const authApi = createApi({
  reducerPath: "authManagement",
  // baseQuery: fetchBaseQuery({baseUrl:"https://localhost:7293/api/"}),                
  baseQuery: fetchBaseQuery({ baseUrl: BE_API_LOCAL }),
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: ({ email, password }) => ({
        url: `user/login`,
        method: "POST",
        body: { email, password },
      }),
    }),

    registerUser: builder.mutation({
      query: (body) => {
        // const users = {
        //   address: body.address,
        //   password: body.password,
        //   username: body.username,
        //   email: body.email,
        //   phoneNumber: body.phoneNumber,
        //   dob: body.dob,
        //   // retype_password: body.retypePassword,
        //   // role_id: body.UserType,
        //   // created_by: "string",
        //   // modified_by: "string",
        //   Gender: body.Gender,
        //   ImgURL:"https://static.vecteezy.com/system/resources/previews/024/983/914/original/simple-user-default-icon-free-png.png"
        // }
        return {
          method: "POST",
          url: `user/create`,
          body: body,
        }
      },
      invalidatesTags: [{ type: " UserList ", id: " LIST " }],
    }),


    verifyOtp: builder.mutation({
      query: (payload) => {
        return {
          method: "POST",
          url: `user/forgotpassword`,
          body: payload,
        };
      },
    }),
    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => {
        return {
          method: "POST",
          url: `user/resetpassword`,
          body: { token: token, newPassword: newPassword },
        };
      },
    }),
    // changePasswordByEmail: builder.mutation({
    //   query: ({ email, newPassword }) => {
    //     return {
    //       method: "POST",
    //       url: `forgotPassword/changePassword/${email}`,
    //       body: { password: newPassword, retypePassword: newPassword },
    //     };
    //   },
    // }),
    // refreshToken: builder.mutation({
    //   query: ({ refreshToken }) => ({
    //     url: `users/refresh-token`,
    //     method: "POST",
    //     body: { refreshToken: refreshToken }, // pass the refresh token in the body
    //   }),
    // }),
    sendResetEmail: builder.mutation({
      query: (email) => ({
        url: `auth/forgot-password`,
        method: "PUT",
        body: { email },
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useSendResetEmailMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation
  //   useChangePasswordByEmailMutation,
  //   useVerifyMailMutation,
  //   useVerifyOtpMutation,
  //   useRefreshTokenMutation,
} = authApi;
