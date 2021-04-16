import React from "react"
import { Text, Box } from "grommet"

export const Condition = ({ condition }: { condition: RecordCondition }) => {
  return (
    <Box
      align="center"
      direction="row"
      gap="xsmall"
      pad={{ vertical: "xsmall", horizontal: "small" }}
      margin="xsmall"
      background="brand"
      round="large"
    >
      <Text size="small">{condition}</Text>
    </Box>
  )
}
