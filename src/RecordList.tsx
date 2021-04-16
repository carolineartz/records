import React from "react"
import { Grid, ResponsiveContext } from "grommet"
import { useReleasesQuery } from "./hooks/queries"

import { RecordListItem } from "./RecordItem/RecordListItem"

export const RecordList = React.memo(() => {
  const [{ data: recordReleases }] = useReleasesQuery()

  return (
    <Grid gap="medium" rows="small" columns={{ count: "fit", size: "small" }}>
      {(recordReleases || []).map((release, i) => (
        <RecordListItem key={`record-${release.record_id}`} release={release} />
      ))}
    </Grid>
  )
})
