export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type Priority = "low" | "medium" | "high";

export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  priority?: Priority;
}

export interface WeeklyData {
  monday: TodoItem[];
  tuesday: TodoItem[];
  wednesday: TodoItem[];
  thursday: TodoItem[];
  friday: TodoItem[];
  saturday: TodoItem[];
  sunday: TodoItem[];
}

export const DAYS_OF_WEEK: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: "月曜日",
  tuesday: "火曜日",
  wednesday: "水曜日",
  thursday: "木曜日",
  friday: "金曜日",
  saturday: "土曜日",
  sunday: "日曜日",
};
