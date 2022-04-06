# 🐳 Docker setup

[🔝 root](../README.md)

> Every command is intended to be run from project root.

## 🏃‍♂️ Run composed app

[📜 prod.docker-compose.yml](composes/prod.docker-compose.yml)

### Bringing up

`docker-compose -p hotel-automation -f .docker/composes/prod.docker-compose.yml up -d`

- `-p` for project name
- `-f` for docker-compose file
- `-d` for detached mode

### Tearing down

`docker-compose -p hotel-automation -f .docker/composes/prod.docker-compose.yml down`

## 🏃‍♂️ Run PmsAdapter

`docker run -d --name pms-adapter --env-file HotelPmsAdapter/.env quipex/pms-adapter`

- `-d` for detached mode
- `--name` for container name
- `--env-file` for specifying env file location

## 🔨 Build PmsAdapter

`docker build -t quipex/pms-adapter -f .docker/images/PmsAdapter.Dockerfile .`
