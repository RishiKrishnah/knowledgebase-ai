import os

OUTPUT_FILE = "project_prompt.txt"

IGNORE_DIRS = {
    "venv",
    "__pycache__",
    ".git",
    ".idea",
    ".vscode"
}

INCLUDE_EXTENSIONS = {
    ".py",
    ".txt",
    ".md",
    ".yaml",
    ".yml",
    ".json"
}


def should_skip(path):
    return any(x in path.split(os.sep) for x in IGNORE_DIRS)


with open(OUTPUT_FILE, "w", encoding="utf-8") as out:

    out.write("========== PROJECT STRUCTURE ==========\n\n")

    for root, dirs, files in os.walk("."):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

        level = root.count(os.sep)
        indent = "    " * level
        out.write(f"{indent}{os.path.basename(root)}/\n")

        for file in files:
            ext = os.path.splitext(file)[1]
            if ext in INCLUDE_EXTENSIONS:
                out.write(f"{indent}    {file}\n")

    out.write("\n\n========== FILE CONTENTS ==========\n\n")

    for root, dirs, files in os.walk("."):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

        for file in files:

            ext = os.path.splitext(file)[1]

            if ext not in INCLUDE_EXTENSIONS:
                continue

            path = os.path.join(root, file)

            try:
                with open(path, encoding="utf-8") as f:
                    content = f.read()

                out.write("\n")
                out.write("=" * 80 + "\n")
                out.write(path + "\n")
                out.write("=" * 80 + "\n\n")
                out.write(content)
                out.write("\n\n")

            except:
                pass

print(f"Generated {OUTPUT_FILE}")