#!/bin/bash

BACKEND_CONTAINER_NAME="back-end"
FRONTEND_CONTAINER_NAME="front-end"

echo Stopped ${BACKEND_CONTAINER_NAME} container
echo Removed ${BACKEND_CONTAINER_NAME} container
docker container rm --force ${BACKEND_CONTAINER_NAME}

echo Stopped ${FRONTEND_CONTAINER_NAME} container
echo Removed ${FRONTEND_CONTAINER_NAME} container
docker container rm --force ${FRONTEND_CONTAINER_NAME}

docker container prune --filter until=30m
docker system prune --all --force
