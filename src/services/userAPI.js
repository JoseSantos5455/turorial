import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { navigate } from "../utils/navigate";
import { selectTokens } from "../slices/auth.slice";
import { COURSE_API_TEST } from "../config";

export const userAPI = createApi({
    reducerPath: "userManager",
    tagTypes: ["UserList"],
    baseQuery: fetchBaseQuery({
        baseUrl: COURSE_API_TEST,
    }),
    endpoints: (builder) => ({
        getAllUser: builder.query({
            query: () => `7377510e-759d-4464-af99-14c868776d43`,
            providesTags: (result) =>
                result
                    ? result.map(({ id }) => ({ type: "UserList", id }))
                    : [{ type: "UserList", id: "LIST" }],
        }),
    }),
});

export const {
    useGetAllUserQuery
} = userAPI;
