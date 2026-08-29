#!/bin/sh
# Подвійний клік по цьому файлу = зібрати програму.
cd "$(dirname "$0")" || exit 1
python3 tools/build.py
echo
echo "Готово. Файл програми: $(pwd)/dist/index.html"
echo "Вікно можна закрити."
