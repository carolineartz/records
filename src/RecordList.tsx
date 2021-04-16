import React from "react"
import { Grid, Card, CardBody, CardFooter, Text, CardHeader, Box, Button, ResponsiveContext } from "grommet"
import { useArtistQuery, useRecordQuery, useReleasesQuery } from "./hooks/queries"
import { useRefCallback } from "./hooks/useRefCallback"
import { useTraceableState } from "./hooks/traceable"

import ContentEditable from "react-contenteditable"
import { FormEdit } from "grommet-icons"
import { UseRecordMutationReturnType } from "./hooks/mutations"
import { useMutation } from "react-query"

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

const RecordListItem = React.memo(({ release }: { release: RecordReleaseData }) => {
  const { data: record } = useRecordQuery(release.record_id)
  const { data: artist } = useArtistQuery(release.artist_id)

  return (
    <Card background="brand" key={record?.album_title} pad="small">
      <CardHeader>{record?.album_title}</CardHeader>
      <CardBody>
        <Box direction="row" align="center" justify="around">
          {record && <YearField record={record} />}

          {record && <Condition condition={record.condition} />}
        </Box>
      </CardBody>
      <CardFooter>{artist && <Text size="large">{artist.name}</Text>}</CardFooter>
    </Card>
  )
})

type YearFieldDesktopProps = {
  record: RecordData
  mobileEnabled?: undefined
}

type YearFieldMobileProps = {
  record: RecordData
  mobileEnabled: boolean
  mobileValue: string
  setMobileValue: (val: string) => void
}

type YearFieldProps = YearFieldMobileProps | YearFieldDesktopProps

const YearField = (props: YearFieldProps) => {
  const isMobile = typeof props.mobileEnabled === "boolean"
  const [text, prevText, setText] = useTraceableState(props.record.year.toString())
  const [disabled, setDisabled] = React.useState(true)
  const updateYearMutation: UseRecordMutationReturnType = useMutation("updateRecord")

  const handleChange = useRefCallback((evt) => {
    const val = evt.target.value

    if (!isNaN(Number(val))) {
      setText(val)
    } else {
      setText(prevText || props.record.year.toString())
    }
  }, [])

  const handleBlur = useRefCallback(() => {
    if (!isMobile) {
      updateYearMutation.mutate({
        ...props.record,
        year: Number(text),
      })

      setDisabled(true)
    }
  }, [isMobile, text, props.record, updateYearMutation])

  return (
    <Box direction="row">
      <ContentEditable
        onBlur={handleBlur}
        disabled={isMobile ? !props.mobileEnabled : disabled}
        onChange={handleChange}
        html={text}
      />
      {!isMobile && disabled && (
        <Button plain icon={<FormEdit />} onClick={() => setDisabled(false)} primary />
      )}
    </Box>
  )
}
