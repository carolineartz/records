import React from "react"
import "styled-components/macro"
import { Text, Box, Collapsible, Select, ThemeContext } from "grommet"
import { EditButton } from "./EditButton"
import { useMutation } from "react-query"
import { UseRecordMutationReturnType } from "../hooks/mutations"

const CONDITION_COLOR_MAP: Record<RecordCondition, string> = {
  mint: "#9ef0d6",
  very_good: "#81dbfc",
  good: "#5b80fc",
  fair: "#ffca58",
  poor: "#ff8a58",
}

export const Condition = ({ record }: { record: RecordData }) => {
  const [show, setShow] = React.useState(false)
  const [hide, setHide] = React.useState(false)
  const [showSelect, setShowSelect] = React.useState(false)
  const [showEdit, setShowEdit] = React.useState(true)
  const updateConditionMutation: UseRecordMutationReturnType = useMutation("updateRecord")

  React.useEffect(() => {
    if (show) {
      setHide(true)
    } else {
      setHide(false)
    }
  }, [show, hide])

  const conditionIndicator = (
    <Box
      width="16px"
      height="16px"
      css="position: absolute; z-index: 1"
      onMouseEnter={() => setShow(true)}
      background={CONDITION_COLOR_MAP[record.condition]}
      round="large"
      animation={show ? "fadeOut" : undefined}
    />
  )

  const conditionContent = (
    <Box
      align="center"
      direction="row"
      justify="center"
      gap="xsmall"
      css="z-index: 2"
      onMouseLeave={() => setShow(false)}
      pad={{ left: "xsmall" }}
      height={{ min: "16px" }}
      background={CONDITION_COLOR_MAP[record.condition]}
      round="large"
    >
      <Text size="10px" css="line-height: 1.1" color="black" weight={600} truncate>
        {record.condition.replaceAll("_", " ").toUpperCase()}
      </Text>

      <EditButton
        title="Edit Condition"
        color="black"
        onClick={() => {
          setShowEdit(false)
          setShowSelect(true)
        }}
        visible={showEdit}
      />
    </Box>
  )

  const handleChangeCondition = (conditionString: string) => {
    const conditionFromString = conditionString.replaceAll(" ", "_").toLowerCase() as RecordCondition
    updateConditionMutation.mutate({
      ...record,
      condition: conditionFromString,
    })
    setShowSelect(false)
  }

  React.useEffect(() => {
    if (!showSelect) {
      setTimeout(() => {
        setShow(false)
        setShowEdit(true)
      }, 500)
    }
  }, [showSelect])

  const conditionSelect = (
    <ConditionSelect
      placeholder="Select"
      alignSelf="end"
      css={"text-align: right;"}
      open
      plain
      icon={false}
      size="small"
      value={record.condition.replaceAll("_", " ").toUpperCase()}
      onClose={() => setShowSelect(false)}
      closeOnChange
      options={Object.keys(CONDITION_COLOR_MAP).map((c) => c.replaceAll("_", " ").toUpperCase())}
      onChange={({ option }) => handleChangeCondition(option)}
    />
  )

  return (
    <>
      <Box css="position: relative" height={{ min: "16px" }} width={{ min: "16px" }}>
        {conditionIndicator}
        <Collapsible direction="horizontal" open={show || showSelect}>
          {conditionContent}
        </Collapsible>
      </Box>
      {showSelect && conditionSelect}
    </>
  )
}

const ConditionSelect = (props: PropsOf<typeof Select>) => {
  return (
    <ThemeContext.Extend
      value={{
        select: {
          options: {
            container: {
              pad: "xsmall",
            },
          },
        },
      }}
    >
      <Select css="display: none" {...props} />
    </ThemeContext.Extend>
  )
}
