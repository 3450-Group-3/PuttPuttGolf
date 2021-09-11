# Group 3 README

## Project Organization
- `/app` contains the `FastAPI` backend API code
- `/client` contains the `React` frontend code

## Tool Stack
- Backend
  - `Python` - Language
  - `FastAPI` - Web framework
  - `SQLite` - Database Engine
  - `SQLAlchemy` - Database ORM
- Frontend
  - `React` - UI library


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

Copy `.env.example` to `.env`

### Start Development Servers
The frontend server can be started with
```
$ yarn dev
```
**Note** that this server is just used for compiling and serving JS assets, and shouldn't be accessed directly!

The API server can be started with
```
$ poetry exec start
```
Now you should be able to go to [localhost:3000](http://localhost:3000) in your browser and see the application running.

## Building the Project
To prepare the project for deployment we need to bunlde the JS assets.
```
$ yarn build
```

## Testing
```
$ poetry exec test
```