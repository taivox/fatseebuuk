#!/bin/bash

# set -e

# cd "$(dirname "$0")"

# BACKEND_CONTAINER_NAME="back-end"
# FRONTEND_CONTAINER_NAME="front-end"

# cd back-end
# docker image build -t back-end .
# echo
# echo 'Back-end api server running at https://localhost:8080/'
# echo
# docker container run -p 8080:8080 --detach --name "${BACKEND_CONTAINER_NAME}" back-end

# cd ..

# cd front-end
# docker image build -t front-end .
# echo
# echo 'Front-end server running at https://localhost:3000/'
# echo
# echo Use \"sh removedocker.sh\" to stop and remove the container.
# echo
# docker container run -p 3000:80 --detach --name "${FRONTEND_CONTAINER_NAME}" front-end

# docker ps --filter "name=${BACKEND_CONTAINER_NAME}" --filter "name=${FRONTEND_CONTAINER_NAME}"

docker-compose up --detach
