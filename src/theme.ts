import { grommet } from "grommet"
import { deepMerge } from "grommet/utils"

export const theme = deepMerge(grommet, {
  global: {
    size: {
      small: "220px",
    },
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
