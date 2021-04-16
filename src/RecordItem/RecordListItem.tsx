import React from "react"
import "styled-components/macro"
import styled from "styled-components"
import { Card, CardBody, CardFooter, Text, CardHeader, Box } from "grommet"
import { useArtistQuery, useRecordQuery } from "../hooks/queries"
import { YearField } from "./YearField"
import { Condition } from "./Condition"
import { useRecordImage } from "../hooks/useRecordImage"

export const RecordListItem = React.memo(({ release }: { release: RecordReleaseData }) => {
  const { data: record } = useRecordQuery(release.record_id)
  const { data: artist } = useArtistQuery(release.artist_id)

  return (
    <>
      {record && artist && (
        <RecordCard
          albumName={record.album_title}
          artistName={artist.name}
          key={record.album_title}
          pad="small"
        >
          <CardHeader>{record.album_title}</CardHeader>
          <CardBody>
            <Box direction="row" align="center" justify="around">
              <YearField record={record} />
              <Condition condition={record.condition} />
            </Box>
          </CardBody>
          <CardFooter>
            <Text size="large">{artist.name}</Text>
          </CardFooter>
        </RecordCard>
      )}
    </>
  )
})

type RecordCardProps = PropsOf<typeof Card> & {
  artistName: string
  albumName: string
  children: React.ReactNode
}

const RecordCard = React.memo(({ artistName, albumName, ...props }: RecordCardProps) => {
  const imageDataURI = useRecordImage({ artistName, albumName })

  return <>{imageDataURI && <ImageCard uri={imageDataURI} {...props} />}</>
})

type ImageCardProps = PropsOf<typeof Card> & { uri?: string }

const ImageCard = styled(Card)<ImageCardProps>`
  background-image: url("${(props) => props.uri}");
  background-size: cover;
`
