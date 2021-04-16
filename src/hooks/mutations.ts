import { QueryClient, useQueryClient, useMutation } from "react-query"

export const createUpdateRecord = (queryClient: QueryClient) => (
  params: { id: string | number } & Partial<Pick<RecordData, "album_title" | "year" | "condition">>
) => updateFromCache({ keyBase: "records", params, queryClient })

export const createUpdateArtist = (queryClient: QueryClient) => (
  params: { id: string | number } & Partial<Pick<ArtistData, "name">>
) => updateFromCache<ArtistData>({ keyBase: "artists", params, queryClient })

async function updateFromCache<T extends { id: string | number }>({
  keyBase,
  params,
  queryClient,
}: {
  keyBase: string
  params: { id: string | number } & Partial<T>
  queryClient: QueryClient
}) {
  const currentData = queryClient.getQueryData<T>([keyBase, params.id])

  if (!currentData) {
    throw new Error("No record to update")
  }
  const nextData: T = {
    ...currentData,
    ...params,
  }

  return nextData
}

////////////////////////////////////////

// currently just using for type return definitions...TODO: figure out the proper type params and remove these
// functions
const useRecordMutation = () => {
  const queryClient = useQueryClient()

  const updateRecord = (
    params: { id: string | number } & Partial<Pick<RecordData, "album_title" | "year" | "condition">>
  ) => updateFromCache({ keyBase: "records", params, queryClient })

  return useMutation(updateRecord, {
    onSuccess: () => {
      queryClient.refetchQueries(["records"], { stale: true })
    },
  })
}

export type UseRecordMutationReturnType = ReturnType<typeof useRecordMutation>

const useArtistMutation = () => {
  const queryClient = useQueryClient()

  const updateArtist = (params: { id: string | number } & Partial<Pick<ArtistData, "name">>) =>
    updateFromCache<ArtistData>({ keyBase: "artists", params, queryClient })

  return useMutation(updateArtist, {
    onSuccess: () => {
      queryClient.refetchQueries(["artists"])
    },
  })
}

export type UseArtistMutationReturnType = ReturnType<typeof useArtistMutation>
