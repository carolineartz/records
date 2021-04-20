import React from "react"
import "styled-components/macro"
import { FormClose } from "grommet-icons"
import { Box, Button, CheckBoxGroup, Keyboard, Text, TextInput } from "grommet"
import RecordFilterContext, { FilterSearchField, ALL_FILTER_FIELDS } from "./RecordFilterContext"
import difference from "lodash.difference"
import initial from "lodash.initial"
import { CONDITION_SELECT_OPTIONS } from "./constants"

export const RecordListFilters = ({ inputIcon }: { inputIcon?: JSX.Element }) => {
  const {
    search,
    setSearch,
    searchFields,
    setSearchFields,
    searchConditions,
    setSearchConditions,
  } = React.useContext(RecordFilterContext)

  // what shows up in the dropdown when focused in the search bar to limit matching search text on
  // a subset of the release (record/artist) field values.
  const filterFieldSuggestions = React.useMemo(() => {
    const possibleSuggestions = difference(ALL_FILTER_FIELDS, searchFields)
    return possibleSuggestions.filter((f) => f.toLowerCase().includes(search?.toLowerCase() || ""))
  }, [search, searchFields])

  const handleRemoveFilterTag = (tag: FilterSearchField) => {
    setSearchFields(searchFields.filter((t) => t !== tag))
  }

  const handleAddFilterTag = (tag: FilterSearchField) => {
    setSearchFields([...searchFields, tag])
    setSearch("")
  }

  const handleClickBackspace = () => {
    // when backspacing without text in the search field, delete the last filter tag added (if applicable)
    if (search?.length === 0) {
      setSearchFields(initial([...searchFields]))
    }
  }

  return (
    <Box pad="small" width="100%">
      <Keyboard onBackspace={handleClickBackspace}>
        <Box direction="row" width="100%">
          {inputIcon}
          <TagInput
            css="width: 100%"
            placeholder="Search records"
            suggestions={filterFieldSuggestions}
            tags={searchFields}
            onRemove={handleRemoveFilterTag}
            onAdd={handleAddFilterTag}
            onChange={(evt) => setSearch(evt.target.value)}
          />
        </Box>
      </Keyboard>
      <Box pad={{ left: "small", top: "medium" }}>
        <Text size="medium" weight={600} margin={{ bottom: "small" }}>
          Filter by Condition
        </Text>
        <CheckBoxGroup
          direction="row"
          wrap // ideally we won't wrap but in case the screen is extremely small, this will ensure they are all accessible.
          className="condition-filter-checkboxes" // for a quick fix for checkboxes not fitting on a single row on very small device viewports
          gap="medium"
          labelKey="label"
          valueKey="value"
          options={CONDITION_SELECT_OPTIONS}
          value={searchConditions}
          onChange={(event) => {
            // TODO: take out grommet PR to fix CheckBoxGroup onChange prop's typing
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
    if (currentTag.length && ALL_FILTER_FIELDS.includes(currentTag as FilterSearchField)) {
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
      <Box
        direction="row"
        width="100%"
        align="center"
        pad={{ horizontal: "xsmall" }}
        ref={boxRef as any}
        wrap
      >
        {tags.length > 0 && renderValue()}
        <Box style={{ width: "100%" }}>
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
