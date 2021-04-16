import React from "react"
import { QueryClient, QueryClientProvider, useQueryClient } from "react-query"
import { persistQueryClient } from "react-query/persistQueryClient-experimental"
import { createLocalStoragePersistor } from "react-query/createLocalStoragePersistor-experimental"
import { ReactQueryDevtools } from "react-query/devtools"
import { createUpdateArtist, createUpdateRecord } from "./hooks/mutations"
import { hydrate, dehydrate } from "react-query/hydration"
import { QueryState } from "react-query/types/core/query"

const options = {
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
}

const setupClient = (client: QueryClient) => {
  client.setMutationDefaults("updateRecord", {
    mutationFn: createUpdateRecord(client),
    onSuccess: (data) => {
      client.setQueryData(["records", data.id], data)
    },
  })

  client.setMutationDefaults("updateArtist", {
    mutationFn: createUpdateArtist(client),
    onSuccess: (data) => {
      client.setQueryData(["artists", data.id], data)
    },
  })
}

const queryClient = new QueryClient(options)
setupClient(queryClient)

const localStoragePersistor = createLocalStoragePersistor({
  localStorageKey: "my-records",
  throttleTime: 500,
})

persistQueryClient({
  queryClient,
  persistor: localStoragePersistor,
})

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WrappedApp>{children}</WrappedApp>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

const WrappedApp = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient()

  React.useEffect(() => {
    const getFromLocalStorage = () => {
      try {
        const myRecordsStored = localStorage.getItem("my-records")
        if (myRecordsStored) {
          const { clientState }: { clientState: QueryState } = JSON.parse(myRecordsStored)
          hydrate(queryClient, clientState, options)
          setupClient(queryClient)
        }
      } catch (e) {
        console.log("ERROR: couldn't hydrate")
        console.warn(e)
      }
    }

    getFromLocalStorage()

    const unload = () => {
      const dataToStore = dehydrate(queryClient)
      localStorage.setItem("my-records-dehydrated", JSON.stringify(dataToStore))
    }

    window.addEventListener("unload", unload)

    return () => {
      unload()
    }
  }, [queryClient])

  return <>{children}</>
}
