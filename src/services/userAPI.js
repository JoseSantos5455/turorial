
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { navigate } from "../utils/navigate";
import { selectTokens } from "../slices/auth.slice";
import { BE_API_LOCAL } from "../config";


export const userAPI = createApi({
    reducerPath: "userManager",
    tagTypes: ["UserList"],
    baseQuery: fetchBaseQuery({
      baseUrl: BE_API_LOCAL,
      prepareHeaders: (headers, { getState }) => {
        const token = selectTokens(getState());
        if (token) {
          headers.append("Authorization", `Bearer ${token}`);
        }
        return headers;
      },
    }),
    endpoints: (builder) => ({
      // Fetch all users with dynamic pagination
      getAllUser: builder.query({
        query: ({ page = 0, limit = 10 }) => ({
          url: `users/get-all-user`,
          method: "GET",
          params: { page, limit }, // Use query params for pagination
        }),
        providesTags: ["UserList"],
      }),
      // Fetch single user detail
      getUserDetail: builder.query({
        query: (id) => ({
          url: `users/get-user/${id}`,
          method: "GET",
        }),
        providesTags: (result, error, id) => [{ type: "UserList", id }],
      }),
      // Change user password
      changePassword: builder.mutation({
        query: ({ userId, old_password, new_password, confirm_password }) => ({
          method: "PUT",
          url: `users/update-password/${userId}`,
          body: { old_password, new_password, confirm_password },
        }),
      }),
      // Update user avatar
      updateAvatar: builder.mutation({
        query: ({ userId, avatar }) => ({
          method: "PUT",
          url: `users/update-avatar/${userId}`,
          body: avatar, // Ensure avatar is in the expected format (FormData or JSON)
        }),
      }),
    }),
  });
  
  // Export hooks for the API
  export const {
    useGetAllUserQuery,
    useGetUserDetailQuery,
    useChangePasswordMutation,
    useUpdateAvatarMutation,
  } = userAPI;
  