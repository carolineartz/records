import { createGlobalStyle } from "styled-components"

export const GlobalStyles = createGlobalStyle`
  // TRANSITION appear-zoom
  .appear-zoom-enter {
    opacity: 0;
    transform: scale(0.9);
  }
  .appear-zoom-enter-active {
    opacity: 1;
    transform: translateX(0);
    transition: opacity 300ms, transform 300ms;
  }
  .appear-zoom-exit {
    opacity: 1;
  }
  .appear-zoom-exit-active {
    opacity: 0;
    transform: scale(0.9);
    transition: opacity 300ms, transform 300ms;
  }

  // TRANSITION expand-left
  .expand-left-enter {
    height: 20px;
    width: 20px;
    /* transform: scale(0.9); */
  }
  .expand-left-enter-active {
    /* opacity: 1; */
    height: 100%;
    width: 100%;
    /* transform: translateX(0); */
    transition: all 1s ease-out;
  }
  .expand-left-exit {
    opacity: 1;
  }
  .expand-left-exit-active {
    height: 20px;
    width: 20px;
    /* transform: scale(0.9); */
    transition: all 1s ease-out;
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
