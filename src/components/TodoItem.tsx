import { useState } from "react";
import type { TodoItem as TodoItemType } from "../types";

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: () => void;
  onUpdate: (title: string) => void;
  onDelete: () => void;
}

export function TodoItem({
  todo,
  onToggle,
  onUpdate,
  onDelete,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(editTitle.trim());
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`todo-item ${todo.completed ? "completed" : ""} ${todo.priority || ""}`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={onToggle}
        className="todo-checkbox"
      />

      {isEditing ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="todo-edit-input"
          autoFocus
        />
      ) : (
        <span className="todo-title" onDoubleClick={() => setIsEditing(true)}>
          {todo.title}
        </span>
      )}

      <button onClick={onDelete} className="todo-delete-btn" title="削除">
        ✕
      </button>
    </div>
  );
}
