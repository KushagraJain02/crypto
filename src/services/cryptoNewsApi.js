import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const cryptoNewsHeaders = {
  "x-rapidapi-key": "085be858bamshee03e4150b086dap13fc17jsnc33891b757ec",
  "x-rapidapi-host": "bing-search-apis.p.rapidapi.com",
};

const baseUrl = "https://bing-search-apis.p.rapidapi.com";

export const cryptoNewsApi = createApi({
  reducerPath: "cryptoNewsApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getCryptoNews: builder.query({
      query: ({ newsCategory, page = 0, size = 20 }) => ({
        url: "/api/rapid/web_search",
        method: "GET",
        headers: cryptoNewsHeaders,
        params: {
          keyword: newsCategory,
          page,
          size,
        },
      }),
    }),
  }),
});

export const { useGetCryptoNewsQuery } = cryptoNewsApi;
