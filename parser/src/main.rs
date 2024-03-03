use clap::Parser;
use serde::{Deserialize, Serialize};
use serde_json::json;
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

#[allow(non_camel_case_types)]
#[derive(clap::ValueEnum, Clone, Debug, Serialize, Default, PartialEq)]
enum TestRunners {
    jest,
    #[default]
    vitest,
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
        /// The name of the track
        #[arg(required = true, short = 'n', long = "name")]
        name: String,
        /// The description of the track
        #[arg(required = true, short = 'd', long = "description")]
        description: String,
        /// The slug of the track
        #[arg(required = true, short = 's', long = "slug")]
        slug: String,
        /// The logo of the track
        #[arg(required = true, short = 'l', long = "logo")]
        logo: String,
        /// The status of the track
        #[arg(required = true, short = 't', long = "status")]
        status: Status,
    },

    #[command(name = "parse", about = "Parse folder into json files")]
    Parse {
        /// The folder to parse
        #[arg(required = true, short = 'f', long = "folder")]
        folder: String,
    },

    #[command(name = "generate", about = "Generate files for a new challenge")]
    Generate {
        /// The test runner, jest or vitest
        #[arg(required = true, short = 't', long = "test-runner")]
        test_runner: TestRunners,

        /// The folder to parse
        #[arg(required = true, short = 'f', long = "folder")]
        folder: String,

        /// The challenge name
        #[arg(required = true, short = 'n', long = "name")]
        name: String,

        /// The track slug
        #[arg(required = true, short = 's', long = "slug")]
        slug: String,
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
            fs::create_dir_all(&track_path).expect("Failed to create track folder");
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
        Command::Generate {
            test_runner,
            folder,
            name,
            slug,
        } => {
            println!(
                "Generating files for a new challenge with test runner: {:?}",
                test_runner
            );
            let folder_path = Path::new(folder.as_str());

            if !folder_path.is_dir() {
                eprintln!("Error: {} is not a directory.", folder_path.display());
                std::process::exit(1);
            }

            let mut result = read_folder(folder_path);
            let path_to_store_files = Path::new("challenges").join(slug.clone()).join(name.clone());
            if !path_to_store_files.is_dir() {
                fs::create_dir_all(&path_to_store_files)
                    .expect("Failed to create challenge folder");
            }
            if test_runner == TestRunners::jest {
                // find jest.config.ts or jest.config.js file in "result" and copy it to the challenge folder
                let jest_config_file = result.iter().find(|item| match item {
                    Item::File { name, content: _ } => {
                        name == "jest.config.ts" || name == "jest.config.js"
                    }
                    _ => false,
                });

                if jest_config_file.is_some() {
                    let jest_config_file = jest_config_file.unwrap();
                    match jest_config_file {
                        Item::File { name, content } => {
                            let mut jest_config_file_path = path_to_store_files.clone();
                            jest_config_file_path.push(name);
                            fs::write(&jest_config_file_path, content)
                                .expect("Failed to create jest.config file");
                        }
                        _ => {}
                    }
                    result.retain(|item| match item {
                        Item::File { name, content: _ } => {
                            name != "jest.config.ts" && name != "jest.config.js"
                        }
                        _ => true,
                    });
                } else {
                    let mut jest_config_file_path = path_to_store_files.clone();
                    jest_config_file_path.push("jest.config.ts");
                    fs::write(
                        &jest_config_file_path,
                        "import {Config} from \"jest\"\nexport default {} satisfies Config",
                    )
                    .expect("Failed to create jest.config file");
                }
            }
            let index_spec_files = result.iter().find(|item| match item {
                Item::File { name, content: _ } => {
                    name.ends_with("index.spec.ts")
                        || name.ends_with("index.spec.js")
                        || name.ends_with("index.spec.jsx")
                        || name.ends_with("index.spec.tsx")
                }
                _ => false,
            });
            if index_spec_files.is_some() {
                let index_spec_files = index_spec_files.unwrap();
                match index_spec_files {
                    Item::File { name: _, content } => {
                        let mut index_spec_files_path = path_to_store_files.clone();
                        index_spec_files_path.push("index.spec.tsx");
                        fs::write(&index_spec_files_path, content)
                            .expect("Failed to create index.spec file");
                    }
                    _ => {}
                }
                result.retain(|item| match item {
                    Item::File { name, content: _ } => {
                        !name.ends_with("index.spec.ts")
                            && !name.ends_with("index.spec.js")
                            && !name.ends_with("index.spec.jsx")
                            && !name.ends_with("index.spec.tsx")
                    }
                    _ => true,
                });
            } else {
                let mut index_spec_files_path = path_to_store_files.clone();
                index_spec_files_path.push("index.spec.tsx");
                fs::write(&index_spec_files_path, "").expect("Failed to create index.spec file");
            }

            fs::write(&path_to_store_files.join("index.md"), "## Challenge")
                .expect("Failed to create index.md file");
            fs::write(&path_to_store_files.join("terminal.ts"), "import type { ITerminalOptions } from \"xterm\";\nexport default {} satisfies ITerminalOptions").expect("Failed to create terminal.ts file");
            fs::write(
                &path_to_store_files.join("challenge.json"),
                json!({
                    "$schema": "../../schema.json",
                "id":name,
                "track_slug":slug,
                "test_runner":test_runner,
                "setup_commands":vec!["pnpm i".to_string(),"clear".to_string()]
                }).to_string(),
            )
            .expect("Failed to create challenge.json file");
            fs::write(
                &path_to_store_files.join("index.ts"),
                format!(
                    "import {{ FrameGroundChallengeExport }} from \"../../src\";\n\nexport default {{
                files:{}
            }} satisfies FrameGroundChallengeExport",
                    serde_json::to_string_pretty(&result).unwrap()
                ),
            )
            .expect("Failed to create index.ts file");
        }
    }
}
