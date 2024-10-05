import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { navigate } from "../utils/navigate";
import { selectTokens } from "../slices/auth.slice";
import { BE_API_LOCAL } from "../config";

export const courseAPI = createApi({
    reducerPath: "courseManager",
    tagTypes: ["CourseList", "Progress"],
    baseQuery: fetchBaseQuery({
        baseUrl: BE_API_LOCAL,

        prepareHeaders: (headers, { getState }) => {
            const token = selectTokens(getState());
            if (token) {
                headers.append("Authorization", `Bearer ${token}`);
            }
            headers.append("Content-Type", "application/json");
            return headers;
        },
    }),
 
    endpoints: (builder) => ({
        getAllCourse: builder.query({
            query: () => `courses/get-all`,
            providesTags: (result) =>
                result
                    ? result.data?.content.map(({ id }) => ({ type: "CourseList", id }))
                    : [{ type: "CourseList", id: "LIST" }],
        }),

        providesTags: (result) =>
            result
                ? result.map(({ id }) => ({ type: "CourseList", id }))
                : [{ type: "CourseList", id: "LIST" }],


        getQuizzDetail: builder.query({
            query: (quizzId) => ({
                url: `https://66ea96c355ad32cda4798cbe.mockapi.io/quizz/${quizzId}`,
                method: "GET",
            }),
        }),
        getMyCourse: builder.query({
            query: () => `4ace85d5-4d7e-4276-a31c-282ca3f8019a`,
            providesTags: (result) =>
                result
                    ? result.map(({ id }) => ({ type: "CourseList", id }))
                    : [{ type: "CourseList", id: "LIST" }],
        }),
        getInfoDetail: builder.query({
            query: (infoId) => ({
                url: `https://653216574d4c2e3f333d9291.mockapi.io/info/${infoId}`,
                method: "GET",
            }),
        }),
        getCourseDetail: builder.query({
            query: () => ({
                // url: `users/getuserprofile/${userId}`,
                url: `https://mocki.io/v1/d479b798-4d03-40ed-891b-2ffccea673b8`,
                method: "GET",
            }),
        }),
        getLearningProgress: builder.query({
            query: ({ courseId, userId }) => ({
                url: `https://66ea96c355ad32cda4798cbe.mockapi.io/proress/${userId}`,
            }),
            providesTags: (result) =>
                result ? [{ type: "Progress", id: "LIST" }] : [],
        }),

        savingNewProgress: builder.mutation({
            query: (payload) => {
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
            invalidatesTags: (res, err, arg) => [{ type: "Progress", id: "LIST" }],

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
        CreateCourse: builder.mutation({
            query: (body) => {
                // console.log(body);
                // const newBody = {
                //   address: body.address,
                //   username: body.userName,
                //   email: body.email,
                //   phoneNumber: body.phoneNumber,
                //   dob: body.dob,
                //   roleId: body.roleId,
                //   gender: body.gender,
                //   status: body.status,
                //   imgUrl: "https://static.vecteezy.com/system/resources/previews/024/983/914/original/simple-user-default-icon-free-png.png",
                // }
                return {
                    method: "POST",
                    url: `courses/create-full-course`,
                    body: body,
                }
            },
            invalidatesTags: [{ type: "CourseList", id: "LIST" }],
        }),


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
        deleteCourse: builder.mutation({
            query: (courseId) => ({
                method: "DELETE",
                url: `courses/delete/${courseId}`,
            }),
            invalidatesTags: [{ type: "CourseList", id: "LIST" }],
        }),
    }),
});

export const {
    useGetAllCourseQuery,
    useGetCourseDetailQuery,
    useGetMyCourseQuery,
    useGetLearningProgressQuery,
    useSavingNewProgressMutation,
    useGetQuizzDetailQuery,
    useGetInfoDetailQuery,
    useCreateCourseMutation,

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
    useDeleteCourseMutation,
} = courseAPI;
