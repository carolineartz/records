declare type PropsOf<TComponent> = TComponent extends React.ComponentType<infer P> ? P : never

declare type PaginatedResponseData<D> = {
  results: D[]
  nextPage?: string
}

declare type RecordCondition = "poor" | "fair" | "good" | "very_good" | "mint"

declare type RecordData = {
  album_title: string
  year: number
  condition: RecordCondition
  artist: ArtistData
}

declare type ArtistData = {
  name: string
  id: number | string
}
