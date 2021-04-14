import React from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { persistQueryClient } from "react-query/persistQueryClient-experimental"
import { createLocalStoragePersistor } from "react-query/createLocalStoragePersistor-experimental"
import { ReactQueryDevtools } from "react-query/devtools"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
})

const localStoragePersistor = createLocalStoragePersistor({
  localStorageKey: "my-records",
  throttleTime: 1000,
})

persistQueryClient({
  queryClient,
  persistor: localStoragePersistor,
})

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
