mod todos;

use todos::{
    add_todo, clear_all_todos, clear_completed_todos, delete_todo,
    get_all_todos, get_data_file_location, update_todo,
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_all_todos,
            add_todo,
            update_todo,
            delete_todo,
            clear_completed_todos,
            clear_all_todos,
            get_data_file_location,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
