import React from "react"
import "styled-components/macro"
import { Text, Box, Collapsible, Select, ThemeContext } from "grommet"
import { EditButton } from "./EditButton"
import { useMutation } from "react-query"
import { UseRecordMutationReturnType } from "../hooks/mutations"
import { CONDITION_COLOR_MAP } from "./../constants"
import { stringToRecordCondition, recordConditionToString } from "../helpers/util"

export const ConditionSelect = ({ record }: { record: RecordData }) => {
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
        {recordConditionToString(record.condition, { upcase: true })}
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
    updateConditionMutation.mutate({
      ...record,
      condition: stringToRecordCondition(conditionString)!,
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
    <CustomSelect
      placeholder="Select"
      alignSelf="end"
      css={"text-align: right;"}
      open
      plain
      icon={false}
      size="small"
      value={recordConditionToString(record.condition)}
      onClose={() => setShowSelect(false)}
      closeOnChange
      options={Object.keys(CONDITION_COLOR_MAP).map((c) => recordConditionToString(c as RecordCondition))}
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

const CustomSelect = (props: PropsOf<typeof Select>) => {
  const colorForCondition = React.useMemo(() => {
    const stringVal = typeof props.value === "string" ? props.value : ""
    const conditionVal = stringToRecordCondition(stringVal)
    if (conditionVal) {
      return CONDITION_COLOR_MAP[conditionVal] || "accent-1"
    } else {
      return "accent-1"
    }
  }, [props.value])

  return (
    <ThemeContext.Extend
      value={{
        dark: false,
        global: {
          colors: {
            selected: colorForCondition,
          },
        },
        select: {
          container: {
            extend: (props: any) => {
              return `
                span {
                  color: ${props.theme.global.colors["dark-1"]};
                }
              `
            },
          },
          options: {
            container: {
              pad: "xsmall",
            },
          },
        },
      }}
    >
      {/* it's not actually display: none -ing the dropdown, just the input which would display the selected value since
       its being displayed alternatively in the UI */}
      <Select css="display: none" {...props} />
    </ThemeContext.Extend>
  )
}
