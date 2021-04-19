import React from "react"
import axios from "axios"
import { QueryClient, QueryKey, useQuery, useQueryClient, UseQueryResult } from "react-query"
import { createStorageSerializer } from "../helpers/persistStorageHelper"
import { v4 as uuid } from "uuid"

const INITIAL_API_ENDPOINT =
  "https://gist.githubusercontent.com/seanders/df38a92ffc4e8c56962e51b6e96e188f/raw/b032669142b7b57ede3496dffee5b7c16b8071e1/page1.json"

const ApiResponseStore = createStorageSerializer<
  Record<string, PaginatedResponseData<RecordData & { artist: ArtistData }>>
>("records_api")

export const useReleasesQuery = (): [
  UseQueryResult<RecordReleaseData[], Error>,
  { getNextPage: () => Promise<void>; hasMore: boolean; isLoading: boolean }
] => {
  const queryClient = useQueryClient()
  const [page, setPage] = React.useState(INITIAL_API_ENDPOINT)
  const [hasMore, setHasMore] = React.useState(true)
  const queryKey: QueryKey = React.useMemo(() => ["record-releases", { page }], [page])
  const [loading, setLoading] = React.useState(false)

  const fetchRecordsReleasesFn = React.useCallback(
    async (page = INITIAL_API_ENDPOINT) => {
      const storedResponses = await ApiResponseStore.load()
      let storedResponse: (RecordData & { artist: ArtistData })[]
      if (storedResponses?.[page]) {
        storedResponse = storedResponses[page].results
      } else {
        let updatedResponse = { ...storedResponses } || {}
        const remoteResponse = await axios.get<
          PaginatedResponseData<Omit<RecordData, "id"> & { artist: ArtistData }>
        >(page)

        const responseData = {
          ...remoteResponse.data,
          results: remoteResponse.data.results.map((d) => ({
            id: uuid(),
            ...d,
          })),
        }

        updatedResponse[page] = responseData
        storedResponse = responseData.results
        await ApiResponseStore.store(updatedResponse)
      }

      // Try to construct from cache before making async call
      const existingData = queryClient.getQueryData<RecordReleaseData[]>(queryKey)

      if (existingData) {
        return existingData
      } else {
        return storedResponse.map((d) => {
          const { artist, ...record } = d
          const storedRecordData = queryClient.getQueryData<RecordData>(["records", record.id])
          const storedArtistData = queryClient.getQueryData<ArtistData>(["artists", artist.id])

          if (!storedRecordData) {
            queryClient.setQueryData(["records", record.id], record)
          }

          if (!storedArtistData) {
            queryClient.setQueryData(["artists", artist.id], artist)
          }

          return {
            record_id: record.id,
            artist_id: artist.id,
          }
        })
      }
    },
    [queryClient, queryKey]
  )

  const fetchRecordReleases = React.useCallback(() => {
    return fetchRecordsReleasesFn(page)
  }, [fetchRecordsReleasesFn, page])

  const query = useQuery<RecordReleaseData[], Error>(queryKey, fetchRecordReleases, {
    keepPreviousData: true,
  })

  const getNextPage = async () => {
    const storedResponses = await ApiResponseStore.load()
    const nextPage = storedResponses?.[page]?.nextPage

    if (nextPage) {
      setLoading(true)
      setPage(nextPage)
      setHasMore(true)
      await query.refetch()
      setLoading(false)
    } else {
      setLoading(false)
      setHasMore(false)
      console.log("NO MORE DATA")
    }
  }

  return [query, { hasMore, getNextPage, isLoading: loading || query.isLoading }]
}

export const useRecordQuery = (id: string | number, opts = {}) => {
  const queryClient = useQueryClient()
  const key = ["records", id]

  const fetchRecord = () => fetchFromCache<RecordData>(key, queryClient)
  return useQuery<RecordData, Error>(key, fetchRecord, opts)
}

export const useArtistQuery = (id: number | string, opts = {}) => {
  const queryClient = useQueryClient()
  const key = ["artists", id]

  const fetchRecord = () => fetchFromCache<ArtistData>(key, queryClient)
  return useQuery<ArtistData, Error>(key, fetchRecord, opts)
}

//////////////////////////////////////////////////////

async function fetchFromCache<T>(key: QueryKey, queryClient: QueryClient): Promise<T> {
  const storedData = queryClient.getQueryData<T>(key)

  if (!storedData) {
    throw new Error("Nothing found in cache")
  }

  return storedData
}
