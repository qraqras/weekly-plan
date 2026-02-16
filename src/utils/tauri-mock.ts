import type { WeeklyData, TodoItem } from "../types";

// インメモリのデータストア（ページリロードで消える）
let memoryData: WeeklyData = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
};

function getStoredData(): WeeklyData {
  return memoryData;
}

function saveData(data: WeeklyData): void {
  memoryData = data;
}

export const mockTauriCommands = {
  get_all_todos: async (): Promise<WeeklyData> => {
    return getStoredData();
  },

  add_todo: async (args: {
    day: string;
    todo: TodoItem;
  }): Promise<WeeklyData> => {
    const data = getStoredData();
    const { day, todo } = args;

    if (day in data) {
      (data as any)[day].push(todo);
      saveData(data);
    }

    return data;
  },

  update_todo: async (args: {
    day: string;
    todoId: string;
    updatedTodo: TodoItem;
  }): Promise<WeeklyData> => {
    const data = getStoredData();
    const { day, todoId, updatedTodo } = args;

    if (day in data) {
      const todos = (data as any)[day];
      const index = todos.findIndex((t: TodoItem) => t.id === todoId);
      if (index !== -1) {
        todos[index] = updatedTodo;
        saveData(data);
      }
    }

    return data;
  },

  delete_todo: async (args: {
    day: string;
    todoId: string;
  }): Promise<WeeklyData> => {
    const data = getStoredData();
    const { day, todoId } = args;

    if (day in data) {
      (data as any)[day] = (data as any)[day].filter(
        (t: TodoItem) => t.id !== todoId,
      );
      saveData(data);
    }

    return data;
  },

  clear_completed_todos: async (): Promise<WeeklyData> => {
    const data = getStoredData();

    Object.keys(data).forEach((day) => {
      (data as any)[day] = (data as any)[day].filter(
        (t: TodoItem) => !t.completed,
      );
    });

    saveData(data);
    return data;
  },

  clear_all_todos: async (): Promise<WeeklyData> => {
    const data: WeeklyData = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    };

    saveData(data);
    return data;
  },

  get_data_file_location: async (): Promise<string> => {
    return "メモリ内（一時保存、リロードで消えます）";
  },
};

// Tauriが利用可能かチェック
export function isTauriAvailable(): boolean {
  return typeof window !== "undefined" && "__TAURI__" in window;
}

// 汎用的なinvoke関数（環境に応じて切り替え）
export async function safeInvoke<T>(command: string, args?: any): Promise<T> {
  if (isTauriAvailable()) {
    // Tauriが利用可能な場合は本物のinvokeを使用
    // 動的インポートでブラウザ環境でのエラーを回避
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      return invoke<T>(command, args);
    } catch (error) {
      // インポート失敗時はモックにフォールバック
      console.warn("Tauri import failed, using mock:", error);
    }
  }

  // ブラウザ環境ではモックを使用
  const mockFn = (mockTauriCommands as any)[command];
  if (!mockFn) {
    throw new Error(`Mock command not found: ${command}`);
  }
  return mockFn(args);
}
