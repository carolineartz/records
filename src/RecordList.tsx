import React from "react"
import { Grid } from "grommet"
import { useReleasesQuery } from "./hooks/queries"
import { InfiniteScroll } from "./InfiniteScroll"
import { RecordListItem } from "./RecordItem/RecordListItem"

export const RecordList = () => {
  const [{ data: recordReleases }, { hasMore, getNextPage }] = useReleasesQuery()
  const [releases, setReleases] = React.useState<RecordReleaseData[]>(recordReleases || [])

  React.useEffect(() => {
    if (recordReleases) {
      setReleases((rel) => [...rel, ...recordReleases])
    }
  }, [recordReleases])

  return (
    <Grid gap="medium" rows="small" columns={{ count: "fit", size: "small" }}>
      <InfiniteScroll
        items={releases}
        hasMore={hasMore}
        loadMore={getNextPage}
        renderFn={(release, i) => {
          return <RecordListItem key={`record-${release.record_id}-${i}`} release={release} />
        }}
      />
    </Grid>
  )
}
