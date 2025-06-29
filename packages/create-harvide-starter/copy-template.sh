#!/bin/bash

set -e

# Define source and destination
SOURCE_DIR="../../"
DEST_ROOT="dist/template" # Root of the template within the dist folder

# Create the root destination directory
mkdir -p "$DEST_ROOT"

# List of files/directories to copy, relative to SOURCE_DIR
# For directories, ensure a trailing slash in the FILES_TO_COPY array for SOURCE_PATH
declare -a FILES_TO_COPY=(
    ".gitignore"
    "turbo.json"
    "bun.lock"
    "package.json"
    "README.md"
    "starter.config.ts"
    "AGENTS.md"
    ".rules"
    ".claude/"
    ".cursor/"
    ".windsurf/"
    ".github/"
    "packages/typescript-config/"
    "packages/eslint-config/"
    "packages/ui/"
    "packages/config/"
    "packages/db/"
    "packages/auth/"
    "apps/client/"
)

# Copy files/directories
for file in "${FILES_TO_COPY[@]}"; do
    SOURCE_PATH="${SOURCE_DIR}${file}"
    DEST_PATH="${DEST_ROOT}/${file}" # DEST_PATH should not have trailing slash here

    # Ensure the parent directory for the destination exists
    mkdir -p "$(dirname "$DEST_PATH")"

    echo "Attempting to copy: $SOURCE_PATH to $DEST_PATH"

    EXCLUDE_ARGS=""
    case "$file" in
        ".github/")
            EXCLUDE_ARGS+=" --exclude='workflows/publish.yml'"
            ;;
        # Add more cases for other directories with specific exclusions if needed
    esac

    if [ -e "$SOURCE_PATH" ]; then
        # If SOURCE_PATH ends with a slash, rsync copies contents.
        # If SOURCE_PATH does not end with a slash, rsync copies the directory itself.
        rsync -a --exclude 'node_modules' --exclude '.next' $EXCLUDE_ARGS "$SOURCE_PATH" "$DEST_PATH"
    else
        echo "Warning: $SOURCE_PATH does not exist. Skipping."
    fi
done

echo "Template files copied to $DEST_ROOT"
