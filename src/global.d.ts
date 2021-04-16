declare type PropsOf<TComponent> = TComponent extends React.ComponentType<infer P> ? P : never

declare type PaginatedResponseData<D> = {
  results: D[]
  nextPage?: string
}

declare type RecordCondition = "poor" | "fair" | "good" | "very_good" | "mint"

declare type RecordReleaseData = {
  record_id: string | number
  artist_id: string | number
}

declare type RecordData = {
  id: string | number
  album_title: string
  year: number
  condition: RecordCondition
}

declare type ArtistData = {
  name: string
  id: number | string
}
