echo Stopped back-end container
docker stop back-end
echo Removed back-end container
docker rm back-end

echo Stopped front-end container
docker stop front-end
echo Removed front-end container
docker rm front-end

docker container prune --filter until=30m
docker system prune -a
