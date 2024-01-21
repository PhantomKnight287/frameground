use clap::Parser;
use serde::{Deserialize, Serialize};
use std::env;
use std::fs;
use std::path::Path;

#[allow(non_camel_case_types)]
#[derive(clap::ValueEnum, Clone, Default, Debug, Serialize)]
enum Status {
    active,
    #[default]
    coming_soon,
}

#[derive(Parser, Debug)]
#[clap(
    version = "1.0",
    author = "PhantomKnight287",
    about = "A command line tool to create tracks for FrameGround or parse folders to json files."
)]
enum Command {
    #[command(name = "create-track", about = "Create a track for FrameGround")]
    CreateTrack {
        #[arg(required = true, short = 'n', long = "name")]
        name: String,

        #[arg(required = true, short = 'd', long = "description")]
        description: String,

        #[arg(required = true, short = 's', long = "slug")]
        slug: String,

        #[arg(required = true, short = 'l', long = "logo")]
        logo: String,

        #[arg(required = true, short = 't', long = "status")]
        status: Status,
    },

    #[command(name = "parse", about = "Parse folder into json files")]
    Parse {
        #[arg(required = true, short = 'f', long = "folder")]
        folder: String,
    },
}

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
    let command = Command::parse();
    match command {
        Command::CreateTrack {
            name,
            description,
            slug,
            logo,
            status,
        } => {
            println!(
                "Creating track with name: {}, description: {}, slug: {}, logo: {}, status: {:?}",
                name, description, slug, logo, status
            );
            // look for challenges folder outside of the parser folder, relative to the current working directory
            let mut challenges_path = env::current_dir().unwrap();
            challenges_path.pop();
            challenges_path.push("challenges");
            // check if challenges folder exists
            if !challenges_path.is_dir() {
                eprintln!("Error: {} is not a directory.", challenges_path.display());
                std::process::exit(1);
            }
            // create track folder
            let mut track_path = challenges_path.clone();
            track_path.push(slug.clone());
            fs::create_dir(&track_path).expect("Failed to create track folder");
            // create track.json
            let mut track_json_path = track_path.clone();
            track_json_path.push("track.json");
            let track_json = format!(
                r#"{{
    "$schema":"../track.schema.json",
    "name": "{}",
    "description": "{}",
    "slug": "{}",
    "logo": "{}",
    "status": "{:#?}"
}}"#,
                name, description, slug, logo, status
            );
            // override track.json if it already exists
            if track_json_path.is_file() {
                fs::remove_file(&track_json_path).expect("Failed to remove track.json");
            }
            fs::write(&track_json_path, track_json).expect("Failed to create track.json");
        }

        Command::Parse { folder } => {
            let folder_path = Path::new(folder.as_str());

            if !folder_path.is_dir() {
                eprintln!("Error: {} is not a directory.", folder_path.display());
                std::process::exit(1);
            }

            let result = read_folder(folder_path);

            // Serialize and write to files.json without the root key
            let json_result = serde_json::to_string_pretty(&result).unwrap();
            fs::write("files.json", json_result).expect("Failed to write to files.json");
        }
    }
}
