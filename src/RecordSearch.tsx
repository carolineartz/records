import React from "react"
import { FormClose } from "grommet-icons"
import { Box, Button, CheckBoxGroup, Keyboard, Text, TextInput } from "grommet"
import RecordFilterContext, { FilterSearchField, ALL_FILTER_FIELDS } from "./RecordFilterContext"
import difference from "lodash.difference"
import { initial } from "lodash"

const CONDITION_OPTIONS = [
  { label: "mint", value: "mint" },
  { label: "very good", value: "very_good" },
  { label: "good", value: "good" },
  { label: "fair", value: "fair" },
  { label: "poor", value: "poor" },
]

export const RecordSearch = () => {
  const {
    search,
    setSearch,
    searchFields,
    setSearchFields,
    searchConditions,
    setSearchConditions,
  } = React.useContext(RecordFilterContext)

  const suggestions = React.useMemo(() => {
    const possibleSuggestions = difference(ALL_FILTER_FIELDS, searchFields)
    return possibleSuggestions.filter((f) => f.toLowerCase().includes(search?.toLowerCase() || ""))
  }, [search, searchFields])

  const handleRemoveTag = (tag: FilterSearchField) => {
    setSearchFields(searchFields.filter((t) => t !== tag))
  }

  const handleAddTag = (tag: FilterSearchField) => {
    setSearchFields([...searchFields, tag])
    setSearch("")
  }

  const handleClickBackspace = () => {
    if (search?.length === 0) {
      setSearchFields(initial([...searchFields]))
    }
  }

  return (
    <Box pad="small">
      <Keyboard onBackspace={handleClickBackspace}>
        <TagInput
          placeholder="Search records"
          suggestions={suggestions}
          tags={searchFields}
          onRemove={handleRemoveTag}
          onAdd={handleAddTag}
          onChange={(evt) => setSearch(evt.target.value)}
        />
      </Keyboard>
      <Box pad={{ left: "medium", top: "medium" }}>
        <CheckBoxGroup
          direction="row"
          labelKey="label"
          valueKey="value"
          options={CONDITION_OPTIONS}
          value={searchConditions}
          onChange={(event) => {
            setSearchConditions((event?.value as unknown) as RecordCondition[])
          }}
        />
      </Box>
    </Box>
  )
}

type FilterTagProps = PropsOf<typeof Box> & {
  children: React.ReactNode
  onClickRemove: PropsOf<typeof Button>["onClick"]
}

const FilterTag = ({ children, onClickRemove, ...rest }: FilterTagProps) => {
  const tag = (
    <Box
      direction="row"
      align="center"
      background="brand"
      pad={{ left: "small", right: "xsmall", vertical: "xxsmall" }}
      margin={{ vertical: "xxsmall" }}
      round="medium"
      {...rest}
    >
      <Text size="xsmall" margin={{ right: "xxsmall" }}>
        {children}
      </Text>
      <FormClose size="small" color="white" />
    </Box>
  )

  return <Button onClick={onClickRemove}>{tag}</Button>
}

type TagInputProps = PropsOf<typeof TextInput> & {
  tags: FilterSearchField[]
  onAdd: (tag: FilterSearchField) => void
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRemove: (tag: FilterSearchField) => void
}

const TagInput = ({ tags = [], onAdd, onChange, onRemove, ...props }: TagInputProps) => {
  const [currentTag, setCurrentTag] = React.useState("")
  const [box, setBox] = React.useState()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const boxRef = React.useCallback(setBox, [])

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTag(event.target.value)
    onChange(event)
  }

  const onAddTag = (tag: FilterSearchField) => {
    onAdd(tag)
  }

  const onEnter = () => {
    if (currentTag.length) {
      onAddTag(currentTag as FilterSearchField)
      setCurrentTag("")
    }
  }

  const renderValue = () =>
    tags.map((tag, index) => (
      <FilterTag margin="xxsmall" key={`${tag}${index + 0}`} onClickRemove={() => onRemove(tag)}>
        {tag}
      </FilterTag>
    ))

  return (
    <Keyboard onEnter={onEnter}>
      <Box direction="row" align="center" pad={{ horizontal: "xsmall" }} ref={boxRef as any} wrap>
        {tags.length > 0 && renderValue()}
        <Box flex style={{ minWidth: "120px" }}>
          <TextInput
            type="search"
            plain
            size="large"
            dropTarget={box}
            onChange={handleChangeInput}
            value={currentTag}
            onSuggestionSelect={(event) => onAddTag(event.suggestion)}
            {...props}
          />
        </Box>
      </Box>
    </Keyboard>
  )
}
