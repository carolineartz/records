import * as React from "react"
import "styled-components/macro"
import { Box, Button, ButtonProps } from "grommet"
import { FormEdit } from "grommet-icons"

type EditButtonProps = Omit<ButtonProps, "icon"> & {
  onClick: (event: React.MouseEvent) => void
  title: string
  visible: boolean
}

const EditButtonComponent = React.forwardRef<typeof Button, EditButtonProps>((props, ref) => {
  return (
    <Box
      animation={
        props.visible
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
        title={props.title}
        hoverIndicator
        icon={<FormEdit size="small" color="white" />}
        size="small"
        onClick={props.onClick}
        css={`
          padding: 3px;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
          border-radius: 100%;
          background-color: rgba(101, 101, 101, 0.5);
        `}
      />
    </Box>
  )
})

export const EditButton = EditButtonComponent
