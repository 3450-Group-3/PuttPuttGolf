@echo off

cmd.exe /c yarn install
cmd.exe /c poetry install

start cmd.exe /k yarn dev
start cmd.exe /k poetry run uvicorn app.main:app --reload --port 3000