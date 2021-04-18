import React from "react"

export type FilterSearchField = "artist" | "album" | "year" | "condition"
export const ALL_FILTER_FIELDS: FilterSearchField[] = ["artist", "album", "year", "condition"]

type RecordFilterContextType = {
  search: string | null
  setSearch: (query: string | null) => void
  searchFields: FilterSearchField[]
  setSearchFields: (fields: FilterSearchField[]) => void
}

export const initialValue: RecordFilterContextType = {
  search: null,
  setSearch: () => {},
  searchFields: [],
  setSearchFields: () => {},
}

const RecordFilterContext = React.createContext<RecordFilterContextType>(initialValue)

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [search, setSearch] = React.useState<string | null>(null)
  const [searchFields, setSearchFields] = React.useState<FilterSearchField[]>([])

  return (
    <RecordFilterContext.Provider
      value={{
        search,
        setSearch,
        searchFields,
        setSearchFields,
      }}
    >
      {children}
    </RecordFilterContext.Provider>
  )
}

export default RecordFilterContext
