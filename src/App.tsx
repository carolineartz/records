import { Box, Grommet, grommet } from "grommet"
import { deepMerge } from "grommet/utils"

const theme = deepMerge(grommet, {
  global: {
    colors: {
      brand: "#228BE6",
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
      </Box>
    </Grommet>
  )
}

export default App
