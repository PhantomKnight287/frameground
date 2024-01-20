use std::env;
use std::fs;
use std::path::Path;
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type")]
enum Item {
    #[serde(rename = "file")]
    File { name: String, content: String },
    #[serde(rename = "folder")]
    Folder { name: String, content: Vec<Item> },
}

fn read_folder(path: &Path) -> Vec<Item> {
    let mut items = Vec::new();

    for entry in fs::read_dir(path).unwrap() {
        let entry = entry.unwrap();
        let entry_path = entry.path();
        let entry_name = entry.file_name().into_string().unwrap();

        // Skip the node_modules folder
        if entry_name == "node_modules" {
            continue;
        }

        if entry_path.is_file() {
            let content = fs::read_to_string(&entry_path).unwrap();
            let file_item = Item::File {
                name: entry_name,
                content,
            };
            items.push(file_item);
        } else if entry_path.is_dir() {
            let folder_item = Item::Folder {
                name: entry_name,
                content: read_folder(&entry_path),
            };
            items.push(folder_item);
        }
    }

    items
}

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() != 2 {
        eprintln!("Usage: {} <folder_path>", args[0]);
        std::process::exit(1);
    }

    let folder_path = &args[1];
    let folder_path = Path::new(folder_path);

    if !folder_path.is_dir() {
        eprintln!("Error: {} is not a directory.", folder_path.display());
        std::process::exit(1);
    }

    let result = read_folder(folder_path);

    // Serialize and write to files.json without the root key
    let json_result = serde_json::to_string_pretty(&result).unwrap();
    fs::write("files.json", json_result).expect("Failed to write to files.json");
}
