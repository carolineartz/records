import React from "react"
import { createStorageSerializer } from "../helpers/persistStorageHelper"

const AlbumArtSourceStore = createStorageSerializer<Record<string, string>>("my-records_art")

export const useRecordImage = ({ artistName, albumName }: { artistName: string; albumName: string }) => {
  const key = React.useMemo(() => `${artistName}-${albumName}`, [albumName, artistName])

  const [imageUrl, setImageUrl] = React.useState<null | string>(null)

  React.useEffect(() => {
    const getImage = async () => {
      try {
        let storedDataMap = (await AlbumArtSourceStore.load()) || {}

        if (storedDataMap[key]) {
          setImageUrl(storedDataMap[key])
        } else {
          console.log("have to make request...")
          let url: string | Error = await require("album-art")(artistName, { size: "medium" })

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return imageUrl
}
