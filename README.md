# moebooru
booru style imageboard

## Client environment variables

```
REACT_APP_BACKEND_URL: url of the server
```

## Server environment variables

```
DB_MONGO_URL: url of the database
DB_MONGO_DB_NAME: database name
PORT: port for the server
IMAGE_DIR: directory to store the files
LOG_DIR: directory to store the logs
TS_NODE_DEV: compiles ts app when files are modified
CORS_ORIGIN: urls to let access to server
REFRESH_TOKEN_SECRET: jwt refresh token
REFRESH_TOKEN_EXPIRES_IN: duration in numbers to store refresh token
ACCESS_TOKEN_SECRET: jwt token secret
ACCESS_TOKEN_EXPIRES_IN: duration in numbers to store the access token
ENCRYPT_SECRET: bcrypt secret
ENCRYPT_SALT_LEVEL: bcrypt salt number
```