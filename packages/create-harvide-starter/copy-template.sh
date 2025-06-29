#!/bin/bash

set -e

# Define source and destination
SOURCE_DIR="../../"
DEST_DIR="dist/template"

# Create destination directory if it doesn't exist
mkdir -p "$DEST_DIR"

# List of files/directories to copy
declare -a FILES_TO_COPY=(
    ".gitignore"
    "turbo.json"
    "bun.lock"
    "package.json"
    "README.md"
    "packages/typescript-config"
    "packages/eslint-config"
    "packages/ui"
    "packages/config"
    "packages/db"
    "packages/auth"
    "apps/client"
    "apps/docs"
    ".claude"
    ".cursor"
    ".windsurf"
    ".github"
    ".rules"
    "AGENTS.md"
)

# Copy files/directories
for file in "${FILES_TO_COPY[@]}"; do
    if [ -e "${SOURCE_DIR}${file}" ]; then
        rsync -a --exclude 'node_modules' --exclude '.next' "${SOURCE_DIR}${file}" "${DEST_DIR}/${file}"
    else
        echo "Warning: ${SOURCE_DIR}${file} does not exist. Skipping."
    fi
done

echo "Template files copied to $DEST_DIR"
