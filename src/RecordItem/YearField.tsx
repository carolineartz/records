import React from "react"
import { Box, Button, Keyboard } from "grommet"
import { useRefCallback } from "../hooks/useRefCallback"
import { useTraceableState } from "../hooks/traceable"
import ContentEditable from "react-contenteditable"
import { FormEdit } from "grommet-icons"
import { UseRecordMutationReturnType } from "../hooks/mutations"
import { useMutation } from "react-query"

type YearFieldDesktopProps = {
  record: RecordData
  mobileEnabled?: undefined
}
type YearFieldMobileProps = {
  record: RecordData
  mobileEnabled: boolean
  mobileValue: string
  setMobileValue: (val: string) => void
}
type YearFieldProps = YearFieldMobileProps | YearFieldDesktopProps

export const YearField = (props: YearFieldProps) => {
  const isMobile = typeof props.mobileEnabled === "boolean"
  const [text, prevText, setText] = useTraceableState(props.record.year.toString())
  const [disabled, setDisabled] = React.useState(true)
  const updateYearMutation: UseRecordMutationReturnType = useMutation("updateRecord")

  const handleChange = useRefCallback((evt) => {
    const val = evt.target.value

    if (!isNaN(Number(val))) {
      setText(val)
    } else {
      setText(prevText || props.record.year.toString())
    }
  }, [])

  const handleBlur = useRefCallback(() => {
    if (!isMobile) {
      updateYearMutation.mutate({
        ...props.record,
        year: Number(text),
      })

      setDisabled(true)
    }
  }, [isMobile, text, props.record, updateYearMutation])

  return (
    <Box direction="row">
      <Keyboard onEnter={handleBlur}>
        <ContentEditable
          onBlur={handleBlur}
          disabled={isMobile ? !props.mobileEnabled : disabled}
          onChange={handleChange}
          html={text}
        />
      </Keyboard>
      {!isMobile && disabled && (
        <Button plain icon={<FormEdit />} onClick={() => setDisabled(false)} primary />
      )}
    </Box>
  )
}
