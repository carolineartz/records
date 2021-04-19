import React from "react"

export type FilterSearchField = "artist" | "album" | "year"
export const ALL_FILTER_FIELDS: FilterSearchField[] = ["artist", "album", "year"]

export type ConditionOption = {
  label: string
  value: RecordCondition
}

type RecordFilterContextType = {
  search: string | null
  setSearch: (query: string | null) => void
  searchFields: FilterSearchField[]
  setSearchFields: (fields: FilterSearchField[]) => void
  searchConditions: RecordCondition[]
  setSearchConditions: (conditions: RecordCondition[]) => void
}

export const initialValue: RecordFilterContextType = {
  search: null,
  setSearch: () => {},
  searchFields: [],
  setSearchFields: () => {},
  searchConditions: [],
  setSearchConditions: () => {},
}

const RecordFilterContext = React.createContext<RecordFilterContextType>(initialValue)

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [search, setSearch] = React.useState<string | null>(null)
  const [searchFields, setSearchFields] = React.useState<FilterSearchField[]>([])
  const [searchConditions, setSearchConditions] = React.useState<RecordCondition[]>([])

  return (
    <RecordFilterContext.Provider
      value={{
        search,
        setSearch,
        searchFields,
        setSearchFields,
        searchConditions,
        setSearchConditions,
      }}
    >
      {children}
    </RecordFilterContext.Provider>
  )
}

export default RecordFilterContext
