# Shirt Store API

API for Shirt Store UI built with [NodeJS](https://nodejs.org/) and the [NestJS](https://nestjs.com/) framework, and uses [MongoDB](https://mongodb.com/) as database.

## Installation

1. Clone the repository and navigate into it:

```zsh
git clone https://github.com/power-f-GOD/shirt-store-API.git && cd shirt-store-api
```

2. Install dependencies:

```zsh
npm i -g pnpm && pnpm i
```

3. Create a `.env` file with the required environment variables. (See the [Environment Variables](#environment-variables) section)

`Hint`: Copy the contents of `.env.example`.

4. Start the server:

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

For the REST API documentation, navigate to (the Swagger API documentation at) `http://${HOST}:${PORT}/api` in your browser.

The WebSocket Gateway documentation is coming soon!.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
