import React from "react"
import "styled-components/macro"
import styled from "styled-components"
import { Card, CardBody, CardFooter, Text, CardHeader, Box } from "grommet"
import { useArtistQuery, useRecordQuery } from "../hooks/queries"
import { Condition } from "./FieldCondition"
import { useRecordImage } from "../hooks/useRecordImage"
import { ContentEditableField } from "./ContentEditableField"
import { UseArtistMutationReturnType, UseRecordMutationReturnType } from "../hooks/mutations"
import { useMutation } from "react-query"
import { useTraceableState } from "../hooks/traceable"

export const RecordListItem = ({ release }: { release: RecordReleaseData }) => {
  const { data: record } = useRecordQuery(release.record_id)
  const { data: artist } = useArtistQuery(release.artist_id)

  return (
    <>
      {record && artist && (
        <RecordCard
          albumName={record.album_title}
          artistName={artist.name}
          key={`${record.album_title}-${artist.name}`}
          css="position: relative;"
        >
          <CardHeader justify="between" css="position: relative;" background="#000000B3" pad="small">
            <Box>
              <Text size="small" weight={600} color="white">
                <AlbumTitleField record={record} />
              </Text>
            </Box>
          </CardHeader>
          <CardBody>
            <Box direction="row" align="center" justify="around"></Box>
          </CardBody>
          <CardFooter background="#000000B3" css="position: relative;">
            <Box pad="xsmall">
              <Text size="xsmall" color="white">
                <AlbumYearField record={record} />
              </Text>
              <Text size="small" weight={600} color="white">
                <ArtistNameField artist={artist} />
              </Text>
            </Box>
            <Box css="position: absolute; right: 10px; bottom: 10px;">
              <Condition record={record} />
            </Box>
          </CardFooter>
        </RecordCard>
      )}
    </>
  )
}

type RecordCardProps = PropsOf<typeof Card> & {
  artistName?: string
  albumName?: string
  children: React.ReactNode
}

const RecordCard = React.memo(({ artistName, albumName, ...props }: RecordCardProps) => {
  const imageDataURI = useRecordImage({ artistName, albumName })

  return <ImageCard uri={imageDataURI} {...props} />
})

type ImageCardProps = PropsOf<typeof Card> & { uri?: string }

const ImageCard = styled(Card)<ImageCardProps>`
  background-image: url("${(props) => props.uri}");
  background-size: cover;
`

// Edit Album Attribute Fields

const AlbumTitleField = ({ record }: { record: RecordData }) => {
  const [disabled, setDisabled] = React.useState(true)
  const [value, setValue] = React.useState(record.album_title)
  const updateTitleMutation: UseRecordMutationReturnType = useMutation("updateRecord")

  return (
    <ContentEditableField
      editButton
      submitOnBlur
      disabled={disabled}
      setDisabled={setDisabled}
      value={value}
      setValue={setValue}
      onSubmit={(value) => {
        updateTitleMutation.mutate({
          ...record,
          album_title: value,
        })
      }}
    />
  )
}

const AlbumYearField = ({ record }: { record: RecordData }) => {
  const [disabled, setDisabled] = React.useState(true)
  const [value, prevValue, setValue] = useTraceableState(record.year)
  const updateYearMutation: UseRecordMutationReturnType = useMutation("updateRecord")

  const setNumericValue = React.useCallback(
    (stringVal: string) => {
      if (prevValue && isNaN(Number(stringVal))) {
        setValue(prevValue)
      } else {
        setValue(Number(stringVal))
      }
    },
    [prevValue, setValue]
  )

  return (
    <ContentEditableField
      editButton
      submitOnBlur
      disabled={disabled}
      setDisabled={setDisabled}
      value={value.toString()}
      setValue={setNumericValue}
      onSubmit={(value) => {
        updateYearMutation.mutate({
          ...record,
          year: Number(value),
        })
      }}
    />
  )
}

const ArtistNameField = ({ artist }: { artist: ArtistData }) => {
  const [disabled, setDisabled] = React.useState(true)
  const [value, setValue] = React.useState(artist.name)
  const updateArtistMutation: UseArtistMutationReturnType = useMutation("updateArtist")

  return (
    <ContentEditableField
      editButton
      submitOnBlur
      disabled={disabled}
      setDisabled={setDisabled}
      value={value}
      setValue={setValue}
      onSubmit={(value) => {
        updateArtistMutation.mutate({
          ...artist,
          name: value,
        })
      }}
    />
  )
}
