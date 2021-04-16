import { Box, Grommet } from "grommet"
import { RecordList } from "./RecordList"
import { GlobalStyles } from "./globalStyles"
import { theme } from "./theme"

const App = () => {
  return (
    <Grommet theme={theme} full>
      <GlobalStyles />
      <Box fill pad="medium">
        <RecordList />
      </Box>
    </Grommet>
  )
}

export default App
