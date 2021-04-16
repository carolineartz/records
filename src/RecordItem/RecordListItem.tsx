import React from "react"
import { Card, CardBody, CardFooter, Text, CardHeader, Box } from "grommet"
import { useArtistQuery, useRecordQuery } from "../hooks/queries"
import { YearField } from "./YearField"
import { Condition } from "./Condition"

export const RecordListItem = React.memo(({ release }: { release: RecordReleaseData }) => {
  const { data: record } = useRecordQuery(release.record_id)
  const { data: artist } = useArtistQuery(release.artist_id)

  return (
    <Card background="brand" key={record?.album_title} pad="small">
      <CardHeader>{record?.album_title}</CardHeader>
      <CardBody>
        <Box direction="row" align="center" justify="around">
          {record && (
            <>
              <YearField record={record} />
              <Condition condition={record.condition} />
            </>
          )}
        </Box>
      </CardBody>
      <CardFooter>{artist && <Text size="large">{artist.name}</Text>}</CardFooter>
    </Card>
  )
})
