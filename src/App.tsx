import { Box, Grommet } from "grommet"
import { RecordList } from "./RecordList"
import { RecordListFilters } from "./RecordListFilters"
import { GlobalStyles } from "./globalStyles"
import { theme } from "./theme"
import { ReactComponent as Logo } from "./logo.svg"

const App = () => {
  return (
    <Grommet theme={theme} full>
      <GlobalStyles />
      <Box width={{ max: "1080px" }} margin="auto" pad={{ top: "large" }}>
        <RecordListFilters inputIcon={<Logo height="50px" />} />
        <Box fill pad={{ top: "large", bottom: "medium", horizontal: "medium" }} direction="column">
          <RecordList />
        </Box>
      </Box>
    </Grommet>
  )
}

export default App
