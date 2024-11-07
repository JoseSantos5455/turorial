import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { navigate } from "../utils/navigate";
import { selectTokens } from "../slices/auth.slice";
import { BE_API_LOCAL } from "../config";


export const paymentAPI = createApi({
    reducerPath: "paymentManager",
    tagTypes: ["PayList"],
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

    }),
    endpoints: (builder) => ({
        createPayment: builder.mutation({
            query: (body) => ({
                url: `orders/create`,
                method: "POST",
                body: body,
            }),
            providesTags: ["PayList"],
        }),
        getAllOrder: builder.query({
            query: () => ({
                url: `purchase`,
                method: "GET"
            }),
            providesTags: ["PayList"],
        }),
    }),
});

export const {
    useCreatePaymentMutation,
    useGetAllOrderQuery
} = paymentAPI;