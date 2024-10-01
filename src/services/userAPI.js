
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { navigate } from "../utils/navigate";
import { selectTokens } from "../slices/auth.slice";
import { BE_API_LOCAL } from "../config";


export const userAPI = createApi({
    reducerPath: "userManager",
    tagTypes: ["UserList"],
    baseQuery: fetchBaseQuery({
        baseUrl: BE_API_LOCAL,
        prepareHeaders: (headers, { getState, endpoint }) => {
            const token = selectTokens(getState());
            if (token) {
                headers.append("Authorization", `Bearer ${token}`);
            }
            if (endpoint !== "updateAvatar") {
                headers.set("Content-Type", "application/json");
            }
            return headers;
        },
        responseHandler: async (response) => {
            // Kiểm tra nếu response có Content-Type là application/json
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return response.json();  // Phân tích cú pháp JSON
            } else {
                return response.text();  // Trả về chuỗi text nếu không phải JSON
            }
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
                body: avatar,
            }),
        }),
        upateUserProfile: builder.mutation({
            query: (payload) => {
                const newBody = {
                    email: payload.email,
                    address: payload.address,
                    full_name: payload.fullname,
                    phone_number: payload.phoneNumber,
                    date_of_birth: payload.dateOfBirth,
                    gender: payload.gender
                }
                return {
                    method: "PUT",
                    url: `users/update-user`,
                    body: newBody,
                };
            },
            invalidatesTags: (res, err, arg) => [{ type: "UserList", id: arg.id }],
        }),
    }),
});

// Export hooks for the API
export const {
    useGetAllUserQuery,
    useGetUserDetailQuery,
    useChangePasswordMutation,
    useUpdateAvatarMutation,
    useUpateUserProfileMutation

} = userAPI;
