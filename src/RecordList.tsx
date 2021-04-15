import React from "react"
import { Grid, Card, CardBody, CardFooter, Text, CardHeader, Box } from "grommet"
import { useQueryRecords } from "./hooks/queries"

export const RecordList = React.memo(() => {
  const [{ data: records }] = useQueryRecords()

  return (
    <Grid gap="medium" rows="small" columns={{ count: "fit", size: "small" }}>
      {(records || []).map((value) => (
        <Card background="brand" key={value.album_title}>
          <CardHeader>{value.album_title}</CardHeader>
          <CardBody pad="small">
            <Box direction="row" align="center" justify="around">
              <Text>{value.year}</Text>
              <Condition condition={value.condition} />
            </Box>
          </CardBody>
          <CardFooter pad={{ horizontal: "medium", vertical: "small" }}>
            <Text size="large">{value.artist.name}</Text>
          </CardFooter>
        </Card>
      ))}
    </Grid>
  )
})

const Condition = ({ condition }: { condition: RecordCondition }) => {
  return (
    <Box
      align="center"
      direction="row"
      gap="xsmall"
      pad={{ vertical: "xsmall", horizontal: "small" }}
      margin="xsmall"
      background="brand"
      round="large"
    >
      <Text size="small">{condition}</Text>
    </Box>
  )
}
