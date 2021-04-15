import React from "react"
import axios from "axios"
import { QueryClient, QueryKey, useQuery, useQueryClient, UseQueryResult } from "react-query"
import keyBy from "lodash.keyby"
import { v4 as uuid } from "uuid"

const INITIAL_API_ENDPOINT =
  "https://gist.githubusercontent.com/seanders/df38a92ffc4e8c56962e51b6e96e188f/raw/b032669142b7b57ede3496dffee5b7c16b8071e1/page1.json"

export const useQueryRecords = (): [
  UseQueryResult<RecordData[], Error>,
  { getNextPage: () => Promise<void> }
] => {
  const queryClient = useQueryClient()
  const [page, setPage] = React.useState(INITIAL_API_ENDPOINT)
  const [nextPage, setNextPage] = React.useState<null | string>(null)

  const fetchRecordsFn = React.useCallback(async (page = INITIAL_API_ENDPOINT) => {
    const resp = await axios.get<PaginatedResponseData<Omit<RecordData, "id">>>(page)
    setNextPage(resp.data.nextPage || null)
    return resp.data.results.map((rd) => {
      return {
        id: uuid(),
        ...rd,
      }
    })
  }, [])

  const fetchRecords = React.useCallback(() => {
    return fetchRecordsFn(page)
  }, [fetchRecordsFn, page])

  const query = useQuery<RecordData[], Error>(["records", page], fetchRecords, {
    keepPreviousData: true,
    onSuccess: (data) => {
      setRecordData(data, queryClient)
      setArtistsData(data, queryClient)
    },
  })

  const getNextPage = React.useCallback(async () => {
    if (nextPage) {
      setPage(nextPage)
    } else {
      console.log("NO MORE DATA")
    }
  }, [nextPage])

  return [query, { getNextPage }]
}

export const useQueryRecord = (id: string) => {
  const queryClient = useQueryClient()
  const key = ["records", id]

  const fetchRecord = () => fetchFromCache<RecordData>(key, queryClient)
  return useQuery<RecordData, Error>(key, fetchRecord)
}

export const useQueryArtists = () => {
  const queryClient = useQueryClient()
  const key = ["artists"]

  const fetchRecords = () => fetchFromCache<ArtistData[]>(key, queryClient)
  return useQuery<ArtistData[], Error>(key, fetchRecords)
}

export const useQueryArtist = (id: number | string) => {
  const queryClient = useQueryClient()
  const key = ["artists", id]

  const fetchRecord = () => fetchFromCache<ArtistData>(key, queryClient)
  return useQuery<ArtistData, Error>(key, fetchRecord)
}

//////////////////////////////////////////////////////

async function fetchFromCache<T>(key: QueryKey, queryClient: QueryClient): Promise<T> {
  const storedData = queryClient.getQueryData<T>(key)

  if (!storedData) {
    throw new Error("Nothing found in cache")
  }

  return storedData
}

const setRecordData = (data: RecordData[], queryClient: QueryClient) => {
  data.forEach((r) => {
    queryClient.setQueryData(["records", r.id], r)
  })
}

const setArtistsData = (newData: RecordData[], queryClient: QueryClient) => {
  const existingArtistsDict = keyBy<ArtistData>(
    queryClient.getQueryData<ArtistData[]>(["artists"]) || [],
    "id"
  )
  const newArtistsDict = keyBy<ArtistData>(
    newData.map((r) => r.artist),
    "id"
  )
  const allArtistsDict = { ...existingArtistsDict, ...newArtistsDict }

  queryClient.setQueryData(["artists"], Object.values(allArtistsDict))

  Object.values(newArtistsDict).forEach((a) => {
    const existingData = queryClient.getQueryData(["artists", a.id])
    if (!existingData) {
      queryClient.setQueryData(["artists", a.id], a)
    }
  })
  // }
}
