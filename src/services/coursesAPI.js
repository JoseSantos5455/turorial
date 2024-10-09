import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
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
            query: ({ page, size }) => `courses/get-all?page=${page}&size=${size}`,
            providesTags: (result) =>
                result
                    ? result.data?.content.map(({ id }) => ({ type: "CourseList", id }))
                    : [{ type: "CourseList", id: "LIST" }],
        }),

        getAllCourseAdmin: builder.query({
            query: ({ page, size }) => `courses/get-all-admin?page=${page}&size=${size}`,
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
            query: () => `https://mocki.io/v1/4ace85d5-4d7e-4276-a31c-282ca3f8019a`,
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

        deleteCourse: builder.mutation({
            query: (courseId) => ({
                method: "DELETE",
                url: `courses/delete/${courseId}`,
            }),
            invalidatesTags: [{ type: "CourseList", id: "LIST" }],
        }),
        CreateCourse: builder.mutation({
            query: (body) => {
                return {
                    method: "POST",
                    url: `courses/create-full-course`,
                    body: body,
                }
            },
            invalidatesTags: [{ type: "CourseList", id: "LIST" }],
        }),
        CreateCourseVideo: builder.mutation({
            query: ({ body, lessonId }) => {
                console.log(body)
                return {
                    method: "POST",
                    url: `videos/create/${lessonId}`,
                    body: body,
                }
            },
            invalidatesTags: [{ type: "CourseList", id: "LIST" }],
        }),
        CreateCourseInfo: builder.mutation({
            query: ({ body, lessonId }) => {
                console.log(body)
                return {
                    method: "POST",
                    url: `infos/create/${lessonId}`,
                    body: body,
                }
            },
            invalidatesTags: [{ type: "CourseList", id: "LIST" }],
        }),
        CreateCourseQuiz: builder.mutation({
            query: (body) => {

                return {
                    method: "POST",
                    url: `quizzes/create-quiz`,
                    body: body,
                }
            },
            invalidatesTags: [{ type: "CourseList", id: "LIST" }],
        }),

        deleteVideoLesson: builder.mutation({
            query: ({ chapterId, lessonId }) => {
                return {
                    method: "DELETE",
                    url: `videos/delete/${chapterId}/${lessonId}`,
                };
            },
            invalidatesTags: (_res, _err, _arg) => [
                { type: "CourseList", id: "LIST" },
            ],
        }),
        deleteInfoLesson: builder.mutation({
            query: ({ chapterId, lessonId }) => {
                return {
                    method: "DELETE",
                    url: `infos/delete/${chapterId}/${lessonId}`,
                };
            },
            invalidatesTags: (_res, _err, _arg) => [
                { type: "CourseList", id: "LIST" },
            ],
        }),
        deleteQuizLesson: builder.mutation({
            query: ({ chapterId, lessonId }) => {
                return {
                    method: "DELETE",
                    url: `quizzes/delete-quiz/${chapterId}/${lessonId}`,
                };
            },
            invalidatesTags: (_res, _err, _arg) => [
                { type: "CourseList", id: "LIST" },
            ],
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



    }),
})

export const {
    useGetAllCourseQuery,
    useGetCourseDetailQuery,
    useGetMyCourseQuery,
    useGetLearningProgressQuery,
    useSavingNewProgressMutation,
    useGetQuizzDetailQuery,
    useGetInfoDetailQuery,
    useCreateCourseMutation,
    useDeleteCourseMutation,
    useGetAllCourseAdminQuery,
    useCreateCourseVideoMutation,
    useCreateCourseInfoMutation,
    useCreateCourseQuizMutation,
    useDeleteVideoLessonMutation,
    useDeleteInfoLessonMutation,
    useDeleteQuizLessonMutation,
} = courseAPI;
