<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  # Task Manager API
Rest API to manage tasks for users.



## Cloning repository


```bash
  git clone https://github.com/DanielESanchez/tasks-mannager-nestjs.git
```
    
## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file. You can also use the file `.env.template` as reference, or you can rename it to `.env` and edit the values.

`DB_PASSWORD`

`DB_NAME`

`DB_HOST`

`DB_PORT`

`DB_USERNAME`

`API_PREFIX`

`API_VERSION`

`API_PORT`

`JWT_EXPIRATION`_*_

`JWT_SECRET`

_*_ _Valid values examples for_ `JWT_EXPIRATION` are `1d`, `2h`, `3m`, _the letter indicates the time unit_

## Running app

### Prerequisites

- Npm (included in [Node.js Package](https://nodejs.org))
- Docker and Docker Compose (you can install both from [Docker's the  official website](https://www.docker.com/))

### Production Deployment
Remember to execute this command inside the project's folder
```bash
  cd /path/to/folder/tasks-manager-nestjs
```
Start containers
```bash
  docker-compose up -d
```


## Documentation
After running the docker-compose command, you will be able to see the documentation for all endpoints using the URL

`{IP}:{PORT}/api/docs` or 

`{DOMAIN}/api/docs` if running in a server already configured to run this app

### Load Admin User

The first time you start the app, you will have to load admin user in order to use endpoints protected with admin role. To do that, you just have to go to the endpoint:

```http
  GET {API_PREFIX}/v{API_VERSION}/auth/admin
```

You can see the full path going to the swagger documentation, and you can try it from there.

If it returns created response, then you will be able to login with admin user using the credentials:

`email: admin@admin.adm`

`password: Admin1234`

## Running Tests

To run tests, first install all dependencies

```bash
  npm install ci
```

Then run command

```bash
  npm run test
```

to execute all unit test or

```bash
  npm run test:cov
```

to execute all test and see the coverage

## Authors

- [@DanielESanchez](https://github.com/DanielESanchez)
