import { createGlobalStyle } from "styled-components"

export const GlobalStyles = createGlobalStyle`
  /* not a great way to do this -- should be done through extending themes */
  @media (max-width: 415px) {
    .condition-filter-checkboxes label {
      font-size: 11px;
    }
  }

  ::-moz-selection {
    color: white;
    background: #f95152;
  }

  ::selection {
    color: white;
    background: #f95152;
  }
`
