import React from "react"
import axios from "axios"
import { useQuery, UseQueryResult } from "react-query"

const INITIAL_API_ENDPOINT =
  "https://gist.githubusercontent.com/seanders/df38a92ffc4e8c56962e51b6e96e188f/raw/b032669142b7b57ede3496dffee5b7c16b8071e1/page1.json"

export const useQueryRecords = (): [
  UseQueryResult<RecordData[], Error>,
  { getNextPage: () => Promise<void> }
] => {
  const [page, setPage] = React.useState(INITIAL_API_ENDPOINT)
  const [nextPage, setNextPage] = React.useState<null | string>(null)

  const fetchRecordsFn = React.useCallback(async (page = INITIAL_API_ENDPOINT) => {
    const resp = await axios.get<PaginatedResponseData<RecordData>>(page)
    setNextPage(resp.data.nextPage || null)
    return resp.data.results
  }, [])

  const fetchRecords = React.useCallback(() => {
    return fetchRecordsFn(page)
  }, [fetchRecordsFn, page])

  const query = useQuery<RecordData[], Error>(["records", page], fetchRecords, {
    keepPreviousData: true,
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
