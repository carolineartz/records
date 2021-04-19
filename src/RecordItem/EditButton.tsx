import * as React from "react"
import "styled-components/macro"
import { Box, Button } from "grommet"
import { FormEdit } from "grommet-icons"

type EditButtonProps = Omit<PropsOf<typeof Button>, "icon"> & {
  visible: boolean
  background?: string
  color?: string
}

export const EditButton = React.forwardRef<typeof Button, EditButtonProps>(
  ({ background = "transparent", visible, color = "white", ...props }, ref) => {
    return (
      <Box
        animation={
          visible
            ? {
                type: "zoomIn",
                delay: 0,
                duration: 1000,
                size: "small",
              }
            : {
                type: "fadeOut",
                delay: 0,
                duration: 300,
                size: "xsmall",
              }
        }
      >
        <Button
          ref={ref as any}
          icon={<FormEdit size="small" color={color} />}
          size="small"
          css={`
            text-align: center;
            padding: 0;
            height: 16px;
            width: 16px;
            border-radius: 100%;
            background-color: ${background};
          `}
          {...props}
        />
      </Box>
    )
  }
)
