import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { navigate } from "../utils/navigate";
import { selectTokens } from "../slices/auth.slice";
import { COURSE_API_TEST, BE_API_LOCAL } from "../config";


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
            // headers.append("Content-Type", "application/json");
            return headers;
        },

  
        },
        fetchFn: async (url, options) => {
            console.log(`Fetching URL: ${BE_API_LOCAL}users/get-all-user?page=0&limit=10`);
            return fetch(url, options);
        }
    }),

    endpoints: (builder) => ({

        getAllUser: builder.query({
            query: () => ({
                url: `users/get-all-user?page=0&limit=10`,
                method: "GET",
            }),
        }),
        getUserDetail: builder.query({
            query: (id) => ({
                url: `users/get-user/${id}`,
                method: "GET",
            }),
        }),
        getUserById: builder.query({
            query: (id) => `users/get-user/${id}`,
            providesTags: (result, error, id) => [{ type: "UserList", id }],
        }),
        changePassword: builder.mutation({
            query: ({ userId, old_password, new_password, confirm_password }) => {
                return {
                    method: "PUT",
                    url: `users/update-password/${userId}`,
                    body: { new_password: new_password, confirm_password: confirm_password, old_password: old_password },
                };
            },
        }),
        updateAvatar: builder.mutation({
            query: ({ userId, avatar }) => {
                return {
                    method: 'PUT',
                    url: `users/update-avatar/${userId}`,
                    body: avatar,
                };
            },
        }),
    }),

});

export const {
    useGetAllUserQuery,
    useGetUserByIdQuery,
    useChangePasswordMutation,
    useUpdateAvatarMutation,
    useGetUserDetailQuery
} = userAPI;
