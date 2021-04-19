import React from "react"
import { createStorageSerializer } from "../helpers/persistStorageHelper"

const AlbumArtSourceStore = createStorageSerializer<Record<string, string>>("my-records_art")

type UseRecordImageParams = {
  artistName: string
  albumName: string
}

export const useRecordImage = ({ artistName, albumName }: UseRecordImageParams) => {
  const key = React.useMemo(() => `${artistName}-${albumName}`, [albumName, artistName])
  const [imageUrl, setImageUrl] = React.useState<null | string>(null)

  React.useEffect(() => {
    const getImage = async () => {
      try {
        const storedDataMap = (await AlbumArtSourceStore.load()) || {}

        if (storedDataMap[key]) {
          setImageUrl(storedDataMap[key])
        } else {
          let url: string | Error | undefined = await require("album-art")(artistName, { size: "medium" })

          if (!url || typeof url !== "string") {
            url = "/default-record.jpg"
          }

          await AlbumArtSourceStore.store({
            ...(await AlbumArtSourceStore.load()),
            [key]: url,
          })

          setImageUrl(url)
        }
      } catch (e) {
        setImageUrl("/default-record.jpg")
      }
    }

    getImage()
  }, [albumName, artistName, key])

  return imageUrl
}
