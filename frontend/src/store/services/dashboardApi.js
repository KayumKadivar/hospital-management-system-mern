const { createApi, fetchBaseQuery } = require('@reduxjs/toolkit/query/react');


export const dashboardApi = createApi({
    reducerPath : 'dashboardApi',
    baseQuery : fetchBaseQuery({ baseUrl: 'http://localhost:4242/api' }),
})