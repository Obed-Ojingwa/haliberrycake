#!/usr/bin/env bash
# C:\Users\Melody\Documents\haliberrycake\backend\build.sh
#
# Render build script.
# Set this as your Build Command in Render dashboard:
#   ./build.sh
# or if rootDir is set to backend:
#   bash build.sh

set -e  # exit immediately if any command fails

echo "==> Upgrading pip..."
pip install --upgrade pip

echo "==> Installing packages (binary-only for compiled packages)..."
pip install \
  --only-binary=pydantic-core,psycopg2-binary,pillow,cryptography \
  -r requirements.txt

echo "==> Build complete."