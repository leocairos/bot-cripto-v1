### Docker 

* sudo service docker start

* sudo docker run --rm --name bot-cripto-v1 --volume "/home/leocairos/bot-cripto-v1:/srv/app" --workdir "/srv/app" --publish 3077:3077 -it node:14 bash

* docker exec -it bot-cripto-v1 bash

* docker-compose up -d

* docker stop bot-cripto-v1

* docker rm bot-cripto-v1