#!/bin/sh
# Подвійний клік по цьому файлу = зібрати свіжий пульт і відкрити його в браузері.
cd "$(dirname "$0")" || exit 1
python3 tools/pult.py && open pult/index.html
