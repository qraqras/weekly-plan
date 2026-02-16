use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TodoItem {
    pub id: String,
    pub title: String,
    pub completed: bool,
    pub priority: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WeeklyData {
    pub monday: Vec<TodoItem>,
    pub tuesday: Vec<TodoItem>,
    pub wednesday: Vec<TodoItem>,
    pub thursday: Vec<TodoItem>,
    pub friday: Vec<TodoItem>,
    pub saturday: Vec<TodoItem>,
    pub sunday: Vec<TodoItem>,
}

impl Default for WeeklyData {
    fn default() -> Self {
        Self {
            monday: Vec::new(),
            tuesday: Vec::new(),
            wednesday: Vec::new(),
            thursday: Vec::new(),
            friday: Vec::new(),
            saturday: Vec::new(),
            sunday: Vec::new(),
        }
    }
}

fn get_data_file_path() -> PathBuf {
    // プロジェクトルートの data/todos.json を使用
    let mut path = std::env::current_dir().unwrap_or_else(|_| PathBuf::from("."));
    path.push("data");

    // dataディレクトリが存在しない場合は作成
    if !path.exists() {
        fs::create_dir_all(&path).ok();
    }

    path.push("todos.json");
    path
}

fn load_todos() -> Result<WeeklyData, String> {
    let path = get_data_file_path();

    if !path.exists() {
        return Ok(WeeklyData::default());
    }

    let content = fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read file: {}", e))?;

    let data: WeeklyData = serde_json::from_str(&content)
        .map_err(|e| format!("Failed to parse JSON: {}", e))?;

    Ok(data)
}

fn save_todos(data: &WeeklyData) -> Result<(), String> {
    let path = get_data_file_path();

    let json = serde_json::to_string_pretty(data)
        .map_err(|e| format!("Failed to serialize data: {}", e))?;

    fs::write(&path, json)
        .map_err(|e| format!("Failed to write file: {}", e))?;

    Ok(())
}

#[tauri::command]
pub fn get_all_todos() -> Result<WeeklyData, String> {
    load_todos()
}

#[tauri::command]
pub fn add_todo(day: String, todo: TodoItem) -> Result<WeeklyData, String> {
    let mut data = load_todos()?;

    match day.as_str() {
        "monday" => data.monday.push(todo),
        "tuesday" => data.tuesday.push(todo),
        "wednesday" => data.wednesday.push(todo),
        "thursday" => data.thursday.push(todo),
        "friday" => data.friday.push(todo),
        "saturday" => data.saturday.push(todo),
        "sunday" => data.sunday.push(todo),
        _ => return Err(format!("Invalid day: {}", day)),
    }

    save_todos(&data)?;
    Ok(data)
}

#[tauri::command]
pub fn update_todo(day: String, todo_id: String, updated_todo: TodoItem) -> Result<WeeklyData, String> {
    let mut data = load_todos()?;

    let todos = match day.as_str() {
        "monday" => &mut data.monday,
        "tuesday" => &mut data.tuesday,
        "wednesday" => &mut data.wednesday,
        "thursday" => &mut data.thursday,
        "friday" => &mut data.friday,
        "saturday" => &mut data.saturday,
        "sunday" => &mut data.sunday,
        _ => return Err(format!("Invalid day: {}", day)),
    };

    if let Some(todo) = todos.iter_mut().find(|t| t.id == todo_id) {
        *todo = updated_todo;
    } else {
        return Err(format!("Todo not found: {}", todo_id));
    }

    save_todos(&data)?;
    Ok(data)
}

#[tauri::command]
pub fn delete_todo(day: String, todo_id: String) -> Result<WeeklyData, String> {
    let mut data = load_todos()?;

    let todos = match day.as_str() {
        "monday" => &mut data.monday,
        "tuesday" => &mut data.tuesday,
        "wednesday" => &mut data.wednesday,
        "thursday" => &mut data.thursday,
        "friday" => &mut data.friday,
        "saturday" => &mut data.saturday,
        "sunday" => &mut data.sunday,
        _ => return Err(format!("Invalid day: {}", day)),
    };

    todos.retain(|t| t.id != todo_id);

    save_todos(&data)?;
    Ok(data)
}

#[tauri::command]
pub fn clear_completed_todos() -> Result<WeeklyData, String> {
    let mut data = load_todos()?;

    data.monday.retain(|t| !t.completed);
    data.tuesday.retain(|t| !t.completed);
    data.wednesday.retain(|t| !t.completed);
    data.thursday.retain(|t| !t.completed);
    data.friday.retain(|t| !t.completed);
    data.saturday.retain(|t| !t.completed);
    data.sunday.retain(|t| !t.completed);

    save_todos(&data)?;
    Ok(data)
}

#[tauri::command]
pub fn clear_all_todos() -> Result<WeeklyData, String> {
    let data = WeeklyData::default();
    save_todos(&data)?;
    Ok(data)
}

#[tauri::command]
pub fn get_data_file_location() -> String {
    get_data_file_path().to_string_lossy().to_string()
}
