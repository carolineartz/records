import React from "react"
import { Grid } from "grommet"
import { useReleasesQuery } from "./hooks/queries"

import { RecordListItem } from "./RecordItem/RecordListItem"

export const RecordList = () => {
  const [{ data: recordReleases }] = useReleasesQuery()

  return (
    <Grid gap="medium" rows="small" columns={{ count: "fit", size: "small" }}>
      {(recordReleases || []).map((release, i) => (
        <RecordListItem key={`record-${release.record_id}`} release={release} />
      ))}
    </Grid>
  )
}
