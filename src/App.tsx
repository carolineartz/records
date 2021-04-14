import { Box, Grommet, grommet } from "grommet"
import { deepMerge } from "grommet/utils"
import { RecordList } from "./RecordList"

const theme = deepMerge(grommet, {
  global: {
    colors: {
      brand: "#80127C",
    },
    font: {
      family: "Poppins, sans-serif",
      size: "14px",
      height: "20px",
    },
  },
})

const App = () => {
  return (
    <Grommet theme={theme} full>
      <Box fill pad="medium">
        <RecordList />
      </Box>
    </Grommet>
  )
}

export default App
