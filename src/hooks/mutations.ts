import { QueryClient, useQueryClient, useMutation } from "react-query"

export const useRecordMutation = () => {
  const queryClient = useQueryClient()

  const updateRecord = (
    params: { id: string } & Partial<Pick<RecordData, "album_title" | "year" | "condition">>
  ) => updateFromCache("records", params, queryClient)

  return useMutation(updateRecord)
}

export const useArtistMutation = () => {
  const queryClient = useQueryClient()

  const updateRecord = (params: { id: string } & Partial<Pick<ArtistData, "name">>) =>
    updateFromCache<ArtistData>("artists", params, queryClient)

  return useMutation(updateRecord)
}

/////////////////////////////////////////////////

async function updateFromCache<T extends { id: string | number }>(
  keyBase: string,
  params: { id: string | number } & Partial<T>,
  queryClient: QueryClient
) {
  queryClient.cancelQueries([keyBase])
  const currentData = queryClient.getQueryData<T>([keyBase, params.id])
  const currentCollectionData = queryClient.getQueryData<T[]>([keyBase])

  if (!currentData) {
    throw new Error("No record to update")
  }
  const nextData: T = {
    ...currentData,
    ...params,
  }

  const nextCollectionData = currentCollectionData?.map((r) => (r.id === params.id ? nextData : r))

  queryClient.setQueryData([keyBase, params.id], nextData)
  queryClient.setQueryData([keyBase], nextCollectionData)

  return nextData
}
