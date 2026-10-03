import os

OUTPUT_FILE = "project_prompt.txt"

# ============================================================
# DIRECTORIES TO IGNORE
# ============================================================

IGNORE_DIRS = {
    "venv",
    ".venv",
    "__pycache__",
    ".git",
    ".idea",
    ".vscode",
    "node_modules",
    ".next",
    "dist",
    "build",
    "coverage",
    ".pytest_cache",
    ".mypy_cache",
    ".ruff_cache",
}


# ============================================================
# SPECIFIC FILES TO IGNORE
# ============================================================

IGNORE_FILES = {
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",

    ".env",
    ".env.local",
    ".env.development",
    ".env.production",

    "project_prompt.txt",
}


# ============================================================
# SPECIFIC PATHS TO IGNORE
#
# Paths are relative to the project root.
# Use "/" even on Windows.
# ============================================================

IGNORE_PATHS = {
    "frontend/package-lock.json",

    # Examples:
    # "backend/data/large_file.json",
    # "frontend/app/test/page.tsx",
    # "backend/.env",
}


# ============================================================
# FILE EXTENSIONS TO INCLUDE
# ============================================================

INCLUDE_EXTENSIONS = {
    ".py",
    ".txt",
    ".md",
    ".ts",
    ".tsx",
    ".yaml",
    ".yml",
    ".json",
}


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def normalize_path(path):
    """
    Convert a path into a normalized project-relative path.
    """
    path = os.path.normpath(path)
    path = path.replace("\\", "/")

    if path.startswith("./"):
        path = path[2:]

    return path


def should_skip_directory(dirname):
    """
    Check whether a directory should be completely ignored.
    """
    return dirname in IGNORE_DIRS


def should_skip_file(path):
    """
    Check whether a file should be ignored.
    """

    normalized_path = normalize_path(path)

    filename = os.path.basename(normalized_path)

    # Ignore by filename
    if filename in IGNORE_FILES:
        return True

    # Ignore by exact relative path
    if normalized_path in IGNORE_PATHS:
        return True

    return False


# ============================================================
# GENERATE PROJECT PROMPT
# ============================================================

with open(OUTPUT_FILE, "w", encoding="utf-8") as out:

    # ========================================================
    # PROJECT STRUCTURE
    # ========================================================

    out.write("========== PROJECT STRUCTURE ==========\n\n")

    for root, dirs, files in os.walk("."):

        # Remove ignored directories
        dirs[:] = [
            d for d in dirs
            if not should_skip_directory(d)
        ]

        # Current directory depth
        level = root.count(os.sep)

        indent = "    " * level

        directory_name = os.path.basename(os.path.abspath(root))

        out.write(f"{indent}{directory_name}/\n")

        for file in files:

            # Skip ignored files
            path = os.path.join(root, file)

            if should_skip_file(path):
                continue

            # Only include selected extensions
            ext = os.path.splitext(file)[1].lower()

            if ext in INCLUDE_EXTENSIONS:
                out.write(f"{indent}    {file}\n")


    # ========================================================
    # FILE CONTENTS
    # ========================================================

    out.write("\n\n========== FILE CONTENTS ==========\n\n")

    for root, dirs, files in os.walk("."):

        # Remove ignored directories
        dirs[:] = [
            d for d in dirs
            if not should_skip_directory(d)
        ]

        for file in files:

            path = os.path.join(root, file)

            # Skip ignored files
            if should_skip_file(path):
                continue

            # Check extension
            ext = os.path.splitext(file)[1].lower()

            if ext not in INCLUDE_EXTENSIONS:
                continue

            try:

                with open(
                    path,
                    "r",
                    encoding="utf-8"
                ) as f:

                    content = f.read()

                out.write("\n")
                out.write("=" * 80 + "\n")
                out.write(normalize_path(path))
                out.write("\n")
                out.write("=" * 80 + "\n\n")

                out.write(content)

                out.write("\n\n")

            except Exception as e:

                print(
                    f"Skipped unreadable file: {path} "
                    f"({e})"
                )


print(f"Generated {OUTPUT_FILE}")