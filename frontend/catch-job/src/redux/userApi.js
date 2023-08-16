import { apiSlice } from "./api";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // method
    getUsers: builder.query({
      query: () => "/users",
      keepUnusedDataFor: 5, // default: 60s -> modified to 5s
    }),
  }),
});

export const { useGetUsersQuery } = usersApiSlice;
