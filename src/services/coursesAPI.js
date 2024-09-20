import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { navigate } from "../utils/navigate";
import { selectTokens } from "../slices/auth.slice";
import { COURSE_API_TEST } from "../config";

export const courseAPI = createApi({
    reducerPath: "courseManager",
    tagTypes: ["CourseList", "Progress"],
    baseQuery: fetchBaseQuery({
        baseUrl: COURSE_API_TEST,

        // prepareHeaders: (headers, { getState }) => {
        //   const token = selectTokens(getState());
        //   if (token) {
        //     headers.append("Authorization", `Bearer ${token}`);
        //   }
        //   headers.append("Content-Type", "application/json");
        //   return headers;
        // },
    }),
    endpoints: (builder) => ({
        getAllCourse: builder.query({
            query: () => `https://mocki.io/v1/aa4a4531-043d-438d-903b-627c62874975`,
            providesTags: (result) =>
                result
                    ? result.map(({ id }) => ({ type: "CourseList", id }))
                    : [{ type: "CourseList", id: "LIST" }],
        }),

        // getUserProfile: builder.query({
        //     query: (userId) => ({
        //         url: `user/${userId}`,
        //         method: "GET",
        //     }),
        // }),
        getCourseDetail: builder.query({
            query: () => ({
                // url: `users/getuserprofile/${userId}`,
                url: `https://mocki.io/v1/e066a26f-fdc1-4063-a546-80e530457d6b`,
                method: "GET",
            }),
        }),
        getLearningProgress: builder.query({
            query: ({ courseId, userId }) => ({
                // query: (courseId) => `learning-progress/${courseId}`,
                url: `https://66ea96c355ad32cda4798cbe.mockapi.io/proress/${userId}`,
                providesTags: (result) =>
                    result ? [{ type: "Progress", id: "LIST" }] : [],
            }),
        }),
        savingNewProgress: builder.mutation({
            query: (payload) => {
                console.log(payload)
                const newBody = {
                    videoId: payload.videoId, 
                    progress: payload.progress, 
                }
                return {
                    method: "PUT",
                    url: `https://66ea96c355ad32cda4798cbe.mockapi.io/proress/${payload.userId}`,
                    body: newBody,
                };
            },
            invalidatesTags: (res, err, arg) => [{ type: "UserList", id: arg.id }],
        }),
        // Endpoint để lưu tiến độ học tập
        // saveLearningProgress: builder.mutation({
        //     query: (progressData) => ({
        //         url: '/learning-progress',
        //         method: 'POST',
        //         body: progressData,
        //     }),
        //     invalidatesTags: [{ type: "Progress", id: progressData.courseId }],
        // }),
        // addUser: builder.mutation({
        //   query: (body) => {
        //     const newBody = {
        //       address: body.address,
        //       username: body.userName,
        //       email: body.email,
        //       phoneNumber: body.phoneNumber,
        //       dob: body.dob,
        //       roleId: body.roleId,
        //       gender: body.gender,
        //       status: body.status,
        //       imgUrl: "https://static.vecteezy.com/system/resources/previews/024/983/914/original/simple-user-default-icon-free-png.png",
        //     }
        //     return {
        //       method: "POST",
        //       url: `auth/admin-create-account`,
        //       body: newBody,
        //     }
        //   },
        //   invalidatesTags: [{ type: "UserList", id: "LIST" }],
        // }),
        // editUser: builder.mutation({
        //   query: (payload) => {
        //     const newBody = {
        //       address: payload.body.address,
        //       userName: payload.body.fullname,
        //       phoneNumber: payload.body.phoneNumber,
        //       dob: payload.body.dob,
        //       gender: payload.body.gender,
        //       imgUrl: payload.body.imgUrl,
        //     }
        //     return {
        //       method: "PUT",
        //       url: `users/` + payload.id,
        //       body: newBody,
        //     };
        //   },
        //   invalidatesTags: (res, err, arg) => [{ type: "UserList", id: arg.id }],
        // }),
        // editProfile: builder.mutation({
        //   query: (payload) => {
        //     return {
        //       method: "PUT",
        //       url: `users/` + payload.id,
        //       body: payload.body,
        //     };
        //   },
        //   invalidatesTags: (res, err, arg) => [{ type: "UserList", id: arg.id }],
        // }),
        // updatePassword: builder.mutation({
        //   query: ({ userId, newPassword, oldPassword }) => {
        //     return {
        //       url: `users/updatepassword`,
        //       method: "PUT",
        //       body: { userId, newPassword, oldPassword },
        //     };
        //   },
        // }),

        // deleteUser: builder.mutation({
        //   query: (payload) => {
        //     return {
        //       method: "DELETE",
        //       url: `users/` + payload,
        //     };
        //   },
        //   invalidatesTags: (_res, _err, _arg) => [
        //     { type: "UserList", id: "LIST" },
        //   ],
        // }),
        // getAllTransaction: builder.query({
        //   query: () => `order/getallorder`,
        //   providesTags: (result) =>
        //     result
        //       ? result.map(({ id }) => ({ type: "TransactionList", id }))
        //       : [{ type: "TransactionList", id: "LIST" }],
        // }),
        // getAllNotification: builder.query({
        //   query: (payload) => `notification/getnotificationbyuserid/` + payload,
        //   providesTags: (result) =>
        //     result
        //       ? result.map(({ id }) => ({ type: "NotificationList", id }))
        //       : [{ type: "NotificationList", id: "LIST" }],
        // }),
        // BanUser: builder.mutation({
        //   query: (payload) => {
        //     const reason = payload.reason;
        //     return {
        //       method: "PUT",
        //       url: `bannedaccount/banuser/${payload.id}?reason=${reason}`,
        //     };
        //   },
        //   invalidatesTags: (res, err, arg) => [{ type: "UserList", id: arg.id }],
        // }),
        // UnBanUser: builder.mutation({
        //   query: (payload) => {
        //     return {
        //       method: "PUT",
        //       url: `bannedaccount/unbanuser/${payload}`,
        //     };
        //   },
        //   invalidatesTags: (res, err, arg) => [{ type: "UserList", id: arg.id }],
        // }),
    }),
});

export const {
    useGetAllCourseQuery,
    useGetCourseDetailQuery,
    useGetLearningProgressQuery,
    useSavingNewProgressMutation
    //   useGetUserProfileQuery,
    //   useEditProfileMutation,
    //   useAddUserMutation,
    //   useEditUserMutation,
    //   useDeleteUserMutation,
    //   useBanUserMutation,
    //   useUnBanUserMutation,
    //   useGetUserProfileForOtherQuery,
    //   useGetAllTransactionQuery,
    //   useUpdatePasswordMutation,
    //   useGetAllNotificationQuery
} = courseAPI;
