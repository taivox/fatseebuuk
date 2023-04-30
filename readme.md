# social-network

This is the repository for our [social-network](https://01.kood.tech/git/root/public/src/branch/master/subjects/social-network) project.

## Instructions

### LIVE version is available &#9755;[HERE](http://176.112.158.22:3000/)&#9756;

#### Pre registered demo users:

| Email             | Password |
| ----------------- | -------- |
| alice@gmail.com   | asd      |
| bob@gmail.com     | asd      |
| charlie@gmail.com | asd      |
| asd@gmail.com     | asd      |
| chad@gmail.com    | asd      |
| kopli@gmail.com   | asd      |
| john@gmail.com    | asd      |
| jane@gmail.com    | asd      |

### Option 1 - Recommended

For Linux systems if you don't have Docker compose installed use `sudo apt install docker-compose`

To run the project using docker, use `docker-compose up --detach`

To view running containers, use `docker ps`

To stop the docker containers, use `docker-compose down`

To delete images and downloaded data, use `bash removedocker.sh`

### Option 2 - Not recommended! Only for advanced users!

Open `back-end/cmd/api/utils.go` and comment out line 180 and uncomment line 182

To run back end api server use `bash runb.sh`

To run front end server use `bash runf.sh`

### Option 3 - Not recommended! Only for advanced users!

Open `back-end/cmd/api/utils.go` and comment out line 180 and uncomment line 182

```
To run back end api server, use the following commands:
cd back-end
go run ./cmd/api

To run front end server, use the following commands:
cd front-end
npm install
npm install sweetalert2
npm start
```

#### Written in [Go](https://go.dev/) version 1.20, [JavaScript](https://en.wikipedia.org/wiki/JavaScript), [React 18.2](https://react.dev/)

##### Authors [taivox](https://01.kood.tech/git/taivox) & [Jserva](https://01.kood.tech/git/Jserva) & [enrisuimets](https://01.kood.tech/git/enrisuimets)
