# Group 3 README

## Project Organization
- `/app` contains the `FastAPI` backend API code
- `/client` contains the `React` frontend code
- `/migrations` contains database migrations generated with alembic
- `/tests` contains the backend Python tests
- The loose files at the root of the project are configuration / setup files

## Tool Stack
- Backend
  - `Python` - Language
  - `FastAPI` - Web framework
  - `SQLite` - Database Engine
  - `SQLAlchemy` - Database ORM
  - `alembic` - Database Migration tool
- Frontend
  - `TypeScript` - Language
  - `React` - UI library
  - `Webpack` - Bundler
  - `Babel` - Transpiler


## Development
This project uses [yarn](https://yarnpkg.com/) and [poetry](https://python-poetry.org/) for dependancy management. You'll need to install them to continue.

Pull down this repository.

Install dependencies:
```bash
# For JS
$ yarn install

# For Python
$ poetry install
```

### Configuration
The application is configured with a `.env` file. An example one is provided, but some fields may need to be populated.

1. Copy `.env.example` to `.env`

2. Generate a secret key with the below command and assign SECRET_KEY to it in `.env`
    ```
    $ openssl rand -hex 32
    ```

### Initialize Database
```
$ alembic upgrade head
```
### Start Development Servers
The frontend server can be started with
```
$ yarn dev
```
**Note** that this server is just used for compiling and serving JS assets, and shouldn't be accessed directly!

The API server can be started with

**NOTE**: the `exec` command is provided by a `poetry` plugin, which are only available when you are in a subshell. Before executing any `exec` commands you need to make sure that you're in a subshell with `poetry shell`
```
$ poetry exec start
```
Now you should be able to go to [localhost:3000](http://localhost:3000) in your browser and see the application running.

## Building the Project
1. To prepare the project for deployment we need to bunlde the JS assets.
    ```
    $ yarn build
    ```
2. In production `ENVIRONMENT` in the `.env` needs to be set to `production` otherwise, it won't serve the bundled JS assets

## Testing
```
$ poetry exec test
```

## Development Notes
- FastAPI implements the OpenAPI spec, and as such can provide automatic API documentation. If the server is running, the docs should be accessible at [localhost:3000/api/docs](http://localhost:3000/api/docs)