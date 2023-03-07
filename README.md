# Shirt Store API

API for Shirt Store UI built with [NodeJS](https://nodejs.org/) and the [NestJS](https://nestjs.com/) framework, and uses [MongoDB](https://mongodb.com/) as database.

## Installation

1. Install and set up Mongo DB locally ([on Mac](https://www.prisma.io/dataguide/mongodb/setting-up-a-local-mongodb-database#setting-up-mongodb-on-macos) or [on Windows](https://www.prisma.io/dataguide/mongodb/setting-up-a-local-mongodb-database#setting-up-mongodb-on-windows)).

2. Clone the repository and navigate into it:

   ```zsh
   git clone https://github.com/power-f-GOD/shirt-store-API.git && cd shirt-store-api
   ```

3. Install dependencies:

   ```zsh
   npm i -g pnpm && pnpm i
   ```

4. Create a `.env` file with the required environment variables. (See the [Environment Variables](#environment-variables) section)

   `Hint:` Copy the contents of `.env.example`.

5. Start the Mongo Daemon \[Server\] (in one terminal):

   ```zsh
   mongod
   ```

`Sidebar:` In a case where the Mongo server doesn't start up, you may want to check that you have a `/data/db/` directory created somewhere in your PC's `Users/<user_name>/` directory. Also, inspect the logs to see the causal error(s).

4. Start the server (in another terminal):

   ```zsh
   pm start:dev
   ```

`Sidebar:` You can set an alias for `pnpm` in your `.zshrc` (on Mac) or `.bashrc` file by including this line `alias pm=pnpm` therein.

## Environment Variables

The following environment variables need to be set in a `.env` file:

- `HOST`: The hostname or IP address that the server will listen on
- `PORT`: The port that the server will run on
- `WS_PORT`: The port number that the WebSocket \[Socket.io\] server will listen on
- `MONGODB_PORT`: The port number of the MongoDB database
- `MONGODB_NAME`: The database name of the MongoDB database
- `MONGODB_URI`: The URI for connecting to the MongoDB database

## Usage

The REST API endpoints can be accessed through `http://${HOST}:${PORT}/api`.

For the (REST API) documentation, navigate to (the Swagger API documentation at) `http://${HOST}:${PORT}/api` in your browser.

The WebSocket Gateway documentation is coming soon!

## Tests

The project uses [Jest](https://jestjs.io/) as the test runner/framework.

To run the tests, simply run the following command:

```zsh
pm test
```

See `package.json` for the rest test scripts.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
