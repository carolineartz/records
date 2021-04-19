import { ALL_CONDITIONS } from "./../constants"

export const stringToRecordCondition = (raw: string): RecordCondition | null => {
  const formatted = raw.toLowerCase().replaceAll(" ", "_")
  const allConditionStrings = ALL_CONDITIONS as string[]
  if (allConditionStrings.includes(formatted)) {
    return formatted as RecordCondition
  } else {
    return null
  }
}

export const recordConditionToString = (condition: RecordCondition, opts: { upcase?: boolean } = {}) => {
  const stringified = condition.replaceAll("_", " ")
  if (opts.upcase) {
    return stringified.toUpperCase()
  } else {
    return stringified
  }
}
