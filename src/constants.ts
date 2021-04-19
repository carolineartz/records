export const ALL_CONDITIONS: RecordCondition[] = ["mint", "very_good", "good", "fair", "poor"]

export const CONDITION_COLOR_MAP: Record<RecordCondition, string> = {
  mint: "#9ef0d6",
  very_good: "#81dbfc",
  good: "#5b80fc",
  fair: "#ffca58",
  poor: "#ff8a58",
}

export const CONDITION_SELECT_OPTIONS = [
  { label: "mint", value: "mint" },
  { label: "very good", value: "very_good" },
  { label: "good", value: "good" },
  { label: "fair", value: "fair" },
  { label: "poor", value: "poor" },
]
