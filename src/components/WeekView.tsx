import { DayColumn } from "./DayColumn";
import { DAYS_OF_WEEK, DAY_LABELS } from "../types";
import { useTodos } from "../hooks/useTodos";

export function WeekView() {
  const {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    clearCompleted,
    clearAll,
    getDataLocation,
  } = useTodos();

  const handleShowDataLocation = async () => {
    const location = await getDataLocation();
    alert(`データ保存先:\n${location}`);
  };

  const handleClearCompleted = () => {
    if (confirm("完了済みのTODOをすべて削除しますか？")) {
      clearCompleted();
    }
  };

  const handleClearAll = () => {
    if (confirm("すべてのTODOを削除しますか？この操作は取り消せません。")) {
      clearAll();
    }
  };

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  if (error) {
    return <div className="error">エラー: {error}</div>;
  }

  return (
    <div className="week-view">
      <header className="app-header">
        <h1>📅 週間TODO</h1>
        <div className="header-actions">
          <button onClick={handleShowDataLocation} className="btn-secondary">
            📁 保存先
          </button>
          <button onClick={handleClearCompleted} className="btn-secondary">
            ✓ 完了済み削除
          </button>
          <button onClick={handleClearAll} className="btn-danger">
            🗑️ すべて削除
          </button>
        </div>
      </header>

      <div className="days-grid">
        {DAYS_OF_WEEK.map((day) => (
          <DayColumn
            key={day}
            day={day}
            label={DAY_LABELS[day]}
            todos={todos[day]}
            onAddTodo={(title) => addTodo(day, title)}
            onToggleTodo={(todoId) => toggleTodo(day, todoId)}
            onUpdateTodo={(todoId, title) => updateTodo(day, todoId, { title })}
            onDeleteTodo={(todoId) => deleteTodo(day, todoId)}
          />
        ))}
      </div>
    </div>
  );
}
