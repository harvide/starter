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

# Explicitly copy .gitignore as gitignore to avoid npm stripping
GITIGNORE_SOURCE="${SOURCE_DIR}.gitignore"
GITIGNORE_DEST="${DEST_ROOT}/gitignore"
if [ -e "$GITIGNORE_SOURCE" ]; then
    echo "Copying .gitignore as gitignore"
    cp "$GITIGNORE_SOURCE" "$GITIGNORE_DEST"
else
    echo "Warning: .gitignore not found. Skipping."
fi

# Copy remaining files/directories
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
    esac

    if [ -e "$SOURCE_PATH" ]; then
        rsync -a --exclude 'node_modules' --exclude '.next' $EXCLUDE_ARGS "$SOURCE_PATH" "$DEST_PATH"
    else
        echo "Warning: $SOURCE_PATH does not exist. Skipping."
    fi
done

echo "Template files copied to $DEST_ROOT"
