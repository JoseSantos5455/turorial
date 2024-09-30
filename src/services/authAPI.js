import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BE_API_LOCAL } from "../config";
///change APi URL 


export const authApi = createApi({
  reducerPath: "authManagement",
  baseQuery: fetchBaseQuery({ baseUrl: BE_API_LOCAL }),
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: ({ login_identifier, password }) => ({
        url: `users/login`,
        method: "POST",
        body: { login_identifier, password },
      }),
    }),

    registerUser: builder.mutation({
      query: (body) => {
        // console.log(body)
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
          url: `users/register`,
          body: body,
        }
      },
      invalidatesTags: [{ type: "UserList", id: " LIST " }],
    }),


    verifyOtp: builder.mutation({
      query: ({ email, otp }) => {
        return {
          method: "POST",
          url: `forgot-password/verify-otp/${email}`,
          body: { email: email, otp: otp },
        };
      },
    }),

    changePasswordByEmail: builder.mutation({
      query: ({ email, new_password, confirm_password }) => {
        return {
          method: "POST",
          url: `forgot-password/change-password/${email}`,
          body: { new_password: new_password, confirm_password: confirm_password },
        };
      },
    }),
    // refreshToken: builder.mutation({
    //   query: ({ refreshToken }) => ({
    //     url: `users/refresh-token`,
    //     method: "POST",
    //     body: { refreshToken: refreshToken }, // pass the refresh token in the body
    //   }),
    // }),
    sendResetEmail: builder.mutation({
      query: (email) => ({
        url: `forgot-password/send-otp/${email}`,
        method: "POST",
        body: { email },
      }),
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
  }),

  
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useSendResetEmailMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useChangePasswordByEmailMutation
  //   useChangePasswordByEmailMutation,
  //   useVerifyMailMutation,
  //   useVerifyOtpMutation,
  //   useRefreshTokenMutation,
} = authApi;
