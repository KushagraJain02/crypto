// services/cryptoApi.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const cryptoApiHeaders = {
  // --- IMPORTANT: Ensure your RapidAPI key is correct and active ---
  // Double-check this key on your RapidAPI dashboard.
  "x-rapidapi-key": "085be858bamshee03e4150b086dap13fc17jsnc33891b757ec",
  "x-rapidapi-host": "coinranking1.p.rapidapi.com",
};

const baseUrl = "https://coinranking1.p.rapidapi.com";

// Helper function to create request objects, now correctly handling query parameters
const createRequest = (url, params = {}) => ({
  url,
  headers: cryptoApiHeaders,
  params: params, // 'params' object will be automatically serialized into query strings
});

export const cryptoApi = createApi({
  reducerPath: "cryptoApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getCryptos: builder.query({
      // Assuming 'limit' is a query parameter, which is common
      query: (count) => createRequest(`/coins`, { limit: count }),
    }),
    getCryptoDetails: builder.query({
      query: (coinId) => createRequest(`/coin/${coinId}`),
    }),
    getCryptoHistory: builder.query({
      query: ({ coinId, timePeriod }) => {
        // --- THIS IS THE CRUCIAL CHANGE FOR THE 404 ERROR ---
        // Most likely, 'timePeriod' is now expected as a query parameter.
        // This will form a URL like: /coin/{coinId}/history?timePeriod={timePeriod}
        return createRequest(`/coin/${coinId}/history`, {
          timePeriod: timePeriod,
        });

        // --- Alternative (if the above doesn't work) ---
        // If 'timePeriod' is still a path segment, but the segment name changed (e.g., 'interval')
        // return createRequest(`/coin/${coinId}/history/${timePeriod}`); // This was your original structure
        // Or if the *endpoint name* changed, e.g., to 'price-history'
        // return createRequest(`/coin/${coinId}/price-history`, { timePeriod: timePeriod });

        // ALWAYS VERIFY WITH THE LATEST COINRANKING API DOCUMENTATION ON RAPIDAPI.COM
      },
    }),
    getExchanges: builder.query({
      // Note: The Coinranking API's /exchanges endpoint often requires a paid plan or specific parameters.
      // If you're on a free plan, this might return an error or empty data.
      query: () => createRequest("/exchanges"),
    }),
  }),
});

export const {
  useGetCryptosQuery,
  useGetCryptoDetailsQuery,
  useGetCryptoHistoryQuery,
  useGetExchangesQuery,
} = cryptoApi;
