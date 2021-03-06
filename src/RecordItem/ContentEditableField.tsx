import React from "react"
import { Box, Keyboard } from "grommet"
import { useRefCallback } from "../hooks/useRefCallback"
import ContentEditable from "react-contenteditable"
import { EditButton } from "./EditButton"

type ContentEditableProps = {
  submitOnBlur?: boolean
  editButton?: boolean
  onSubmit?: (val: string) => void
  value: string
  setValue: (val: string) => void
  disabled: boolean
  setDisabled: (disable: boolean) => void
  title?: string
}

export const ContentEditableField = (props: ContentEditableProps) => {
  const [initialValue] = React.useState(props.value)
  const [showEdit, setShowEdit] = React.useState(false)
  const editableRef = React.createRef<any>()
  const editButtonRef = React.useRef<any>(null)

  const handleChange = useRefCallback(
    (evt) => {
      const val = evt.target.value
      props.setValue(val || "")
    },
    [initialValue]
  )

  const handleBlur = useRefCallback(() => {
    if (props.submitOnBlur) {
      props.setDisabled(true)
      setShowEdit(false)
      if (!props.value) {
        props.setValue(initialValue) // Don't allow empty titles
      } else {
        props.onSubmit?.(props.value)
      }
    }
  }, [props.value, props.submitOnBlur, props.editButton, props.setDisabled, props.onSubmit])

  React.useEffect(() => {
    if (!props.disabled) {
      // Hack to make .focus work for contenteditable
      // https://stackoverflow.com/a/37162116/7945147
      setTimeout(() => {
        editableRef.current?.focus()
      }, 0)
    }
  }, [props.disabled, editableRef])

  return (
    <Box
      direction="row"
      gap="xsmall"
      css="position: relative"
      align="center"
      onMouseEnter={() => props.editButton && props.disabled && setShowEdit(true)}
      onMouseLeave={() => props.editButton && props.disabled && setShowEdit(false)}
    >
      <Keyboard onEnter={handleBlur}>
        <ContentEditable
          innerRef={editableRef}
          onBlur={handleBlur}
          disabled={props.disabled}
          onChange={handleChange}
          html={props.value}
        />
      </Keyboard>
      <Box
        css={`
          position: absolute;
          top: -2px;
          right: -15px;
        `}
      >
        {props.editButton && (
          <EditButton
            ref={editButtonRef}
            visible={showEdit}
            title={props.title}
            hoverIndicator
            background="rgba(101, 101, 101, 0.5)"
            onClick={() => {
              props.setDisabled(false)
              setShowEdit(false)
            }}
          />
        )}
      </Box>
    </Box>
  )
}
