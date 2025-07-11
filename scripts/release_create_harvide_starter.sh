#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Navigate to the create-harvide-starter package directory
cd packages/create-harvide-starter

# Get the current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "Current version: $CURRENT_VERSION"

# Bump the minor version without creating a git tag
npm version minor --no-git-tag-version

# Get the new version
NEW_VERSION=$(node -p "require('./package.json').version")
echo "New version: $NEW_VERSION"

# Navigate back to the root directory
cd ../..

# Create a git tag
TAG_NAME="create-harvide-starter@v$NEW_VERSION"
git tag "$TAG_NAME"

# Push the tag
git push origin "$TAG_NAME"

echo "Successfully bumped version to $NEW_VERSION and pushed tag $TAG_NAME"
