docker-compose down
docker-compose pull
docker-compose up -d
docker rmi $(docker images --filter "dangling=true" -q --no-trunc)
docker rm $(docker ps -qa --no-trunc --filter "status=exited")