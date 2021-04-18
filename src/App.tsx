import { Box, Grommet } from "grommet"
import { RecordList } from "./RecordList"
import { RecordSearch } from "./RecordSearch"
import { GlobalStyles } from "./globalStyles"
import { theme } from "./theme"

const App = () => {
  return (
    <Grommet theme={theme} full>
      <GlobalStyles />
      <Box width={{ max: "1080px" }} margin="auto" pad={{ top: "large" }}>
        <RecordSearch />
        <Box fill pad="medium" direction="column">
          <RecordList />
        </Box>
      </Box>
    </Grommet>
  )
}

export default App
