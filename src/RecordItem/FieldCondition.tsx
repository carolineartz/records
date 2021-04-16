import React from "react"
import "styled-components/macro"
import { Text, Box, Collapsible } from "grommet"

const CONDITION_COLOR_MAP: Record<RecordCondition, string> = {
  mint: "#9ef0d6",
  very_good: "#81dbfc",
  good: "#5b80fc",
  fair: "#ffca58",
  poor: "#ff8a58",
}

export const Condition = ({ condition }: { condition: RecordCondition }) => {
  const [show, setShow] = React.useState(false)
  const [hide, setHide] = React.useState(false)

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
      background={CONDITION_COLOR_MAP[condition]}
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
      pad={{ horizontal: "xsmall" }}
      height={{ min: "16px" }}
      background={CONDITION_COLOR_MAP[condition]}
      round="large"
    >
      <Text size="10px" css="line-height: 1.1" color="black" weight={600} truncate>
        {condition.replaceAll("_", " ").toUpperCase()}
      </Text>
    </Box>
  )

  return (
    <Box css="position: relative" height={{ min: "16px" }} width={{ min: "16px" }}>
      {conditionIndicator}
      <Collapsible direction="horizontal" open={show}>
        {conditionContent}
      </Collapsible>
    </Box>
  )
}
