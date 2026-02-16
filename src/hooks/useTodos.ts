import { useState, useEffect, useCallback } from "react";
import { safeInvoke } from "../utils/tauri-mock";
import type { WeeklyData, TodoItem, DayOfWeek } from "../types";

export function useTodos() {
  const [todos, setTodos] = useState<WeeklyData>({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await safeInvoke<WeeklyData>("get_all_todos");
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const addTodo = useCallback(async (day: DayOfWeek, title: string) => {
    try {
      const newTodo: TodoItem = {
        id: crypto.randomUUID(),
        title,
        completed: false,
      };
      const data = await safeInvoke<WeeklyData>("add_todo", {
        day,
        todo: newTodo,
      });
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  const updateTodo = useCallback(
    async (day: DayOfWeek, todoId: string, updates: Partial<TodoItem>) => {
      try {
        const currentTodo = todos[day].find((t) => t.id === todoId);
        if (!currentTodo) return;

        const updatedTodo: TodoItem = {
          ...currentTodo,
          ...updates,
        };
        const data = await safeInvoke<WeeklyData>("update_todo", {
          day,
          todoId,
          updatedTodo,
        });
        setTodos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    },
    [todos],
  );

  const deleteTodo = useCallback(async (day: DayOfWeek, todoId: string) => {
    try {
      const data = await safeInvoke<WeeklyData>("delete_todo", { day, todoId });
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  const toggleTodo = useCallback(
    async (day: DayOfWeek, todoId: string) => {
      const todo = todos[day].find((t) => t.id === todoId);
      if (todo) {
        await updateTodo(day, todoId, { completed: !todo.completed });
      }
    },
    [todos, updateTodo],
  );

  const clearCompleted = useCallback(async () => {
    try {
      const data = await safeInvoke<WeeklyData>("clear_completed_todos");
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  const clearAll = useCallback(async () => {
    try {
      const data = await safeInvoke<WeeklyData>("clear_all_todos");
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  const getDataLocation = useCallback(async (): Promise<string> => {
    try {
      return await safeInvoke<string>("get_data_file_location");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      return "";
    }
  }, []);

  return {
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
    reload: loadTodos,
  };
}
