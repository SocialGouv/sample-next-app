#!/bin/sh
echo "DOTENV_CONFIG_PATH=$PWD/.gitlab-ci.env npx kosko generate --cwd $PWD/yop/kosko --require dotenv/config"
DOTENV_CONFIG_PATH=$PWD/.gitlab-ci.env npx kosko generate --cwd $PWD/yop/kosko --require dotenv/config
