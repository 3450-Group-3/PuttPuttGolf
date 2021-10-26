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

## Style Guide
This project follows the style guides of the technologies being used and enforced by a linter and formatter.

### Python
- `snake_case` for variable and function names, `PascalCase` for class names
- 4 spaced identation (spaces only to avoid mixed indentation errors)

### Javascript
- `camelCase` for variable names, `PascalCase` for class names
- 2 space identations
- `PascalCase` for component names and their related files (i.e the `Home` component would exist in `Home.tsx`)
- Specific styles configurations can be seen in `.prettierrc`

## Development
This project uses [yarn](https://yarnpkg.com/) and [poetry](https://python-poetry.org/) for dependancy management. You'll need to install them to continue.
Please make sure you have [nodeJS](https://nodejs.org/en/) installed and then use `npm install -g yarn` to install yarn. To install poetry on windows use the python package manager pip and run `pip install --user poetry`. If on linux run the command `curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -`

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
    **Note:** This being a cryptographically secure key is only really relevant for production, in development / testing, it can be left alone
### Initialize Database
```
$ poetry run alembic upgrade head
```
**Note** that `poetry run` is used to run any command inside the virtual environment.

### Start Development Servers
The frontend server can be started with
```
$ yarn dev
```
**Note** that this server is just used for compiling and serving JS assets, and shouldn't be accessed directly!

The API server can be started with  
 **NOTE**:  
 > the `exec` command is provided by a `poetry` plugin, which are only available when you are in a subshell. Before executing any `exec` commands you need to make sure that you're in a subshell with `poetry shell`  
 
 **NOTE**:  
 > the `exec` command provided by the plugin only works in unix shells, if you are on windows, make sure you run `poetry shell` then proceed to run `uvicorn app.main:app --reload --port 3000`. You can also just run the single command `poetry run uvicorn app.main:app --reload --port 3000`. A third option is to make sure you are in the root folder of the project and then using command prompt, then run the batch script `startserver.bat` within the command prompt.  
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
1. Linux
    ```
    poetry exec test
    ```
2. Windows
    ```
    runtests.bat
    ```
    

## Development Notes
- FastAPI implements the OpenAPI spec, and as such can provide automatic API documentation. If the server is running, the docs should be accessible at [localhost:3000/api/docs](http://localhost:3000/api/docs)

### Migrations
To create a migration, edit / create your new models.  
**NOTE**: make sure you are in a poetry venv using either `poetry shell` or `poetry run`

Run this command to generate the migration file
```
$ alembic revision -m "<message>" --autogenerate
```
To upgrade your DB
```
$ alembic upgrade head
```
**Note** alembic doesn't detect these changes: https://alembic.sqlalchemy.org/en/latest/autogenerate.html#what-does-autogenerate-detect-and-what-does-it-not-detect

## Version Control Procedures
- Make a new branch
- Implement your features
- Create a pull request
- Have someone review the pr
- Merge and delete the branch
