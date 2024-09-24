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
            const token = sessionStorage.getItem("token");
            if (token) {
                headers.append("Authorization", `Bearer ${token}`);
            }
            headers.append("Content-Type", "application/json");
            return headers;
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
    }),
});

export const {
    useGetAllUserQuery,
    useGetUserDetailQuery
} = userAPI;
