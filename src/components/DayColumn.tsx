import { TodoItem } from "./TodoItem";
import { AddTodoForm } from "./AddTodoForm";
import type { TodoItem as TodoItemType, DayOfWeek } from "../types";

interface DayColumnProps {
  day: DayOfWeek;
  label: string;
  todos: TodoItemType[];
  onAddTodo: (title: string) => void;
  onToggleTodo: (todoId: string) => void;
  onUpdateTodo: (todoId: string, title: string) => void;
  onDeleteTodo: (todoId: string) => void;
}

export function DayColumn({
  label,
  todos,
  onAddTodo,
  onToggleTodo,
  onUpdateTodo,
  onDeleteTodo,
}: DayColumnProps) {
  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  return (
    <div className="day-column">
      <div className="day-header">
        <h2>{label}</h2>
        {totalCount > 0 && (
          <span className="day-count">
            {completedCount}/{totalCount}
          </span>
        )}
      </div>

      <AddTodoForm onAdd={onAddTodo} />

      <div className="todos-list">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => onToggleTodo(todo.id)}
            onUpdate={(title) => onUpdateTodo(todo.id, title)}
            onDelete={() => onDeleteTodo(todo.id)}
          />
        ))}
      </div>
    </div>
  );
}
