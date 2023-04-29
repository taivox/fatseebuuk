clear
cd back-end
docker image build -t back-end .
echo
echo 'Back-end api server running at https://localhost:8080/'
echo
docker container run -p 8080:8080 --detach --name back-end back-end
docker ps

cd ..

cd front-end
docker image build -t front-end .
echo
echo 'Front-end server running at https://localhost:3000/'
echo
echo Use \"sh removedocker.sh\" to stop and remove the container.
echo
docker container run -p 3000:80 --detach --name front-end front-end

docker ps
