import React from "react"
import { Box, Grid, InfiniteScroll } from "grommet"
import { useReleasesQuery } from "./hooks/queries"
import { RecordListItem } from "./RecordItem/RecordListItem"

export const RecordList = () => {
  const [{ data: recordReleases }, { getNextPage }] = useReleasesQuery()
  const [releases, setReleases] = React.useState<RecordReleaseData[]>(recordReleases || [])

  React.useEffect(() => {
    if (recordReleases) {
      setReleases((rel) => [...rel, ...recordReleases])
    }
  }, [recordReleases])

  return (
    <Box margin={{ bottom: "xlarge" }} pad={{ bottom: "xlarge" }}>
      <Grid gap="medium" rows="small" columns={{ count: "fit", size: "small" }}>
        <InfiniteScroll items={releases} onMore={getNextPage} step={25}>
          {(release: RecordReleaseData, i: number) => (
            <RecordListItem key={`record-${release.record_id}-${i}`} release={release} />
          )}
        </InfiniteScroll>
      </Grid>
    </Box>
  )
}
