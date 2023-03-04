const { MONGODB_URI: DB_URI, PORT: P, WS_PORT: WS_P } = process.env;
const MONGODB_URI = DB_URI || '';
const PORT = +(P || 3100);
const WS_PORT = +(WS_P || PORT + 1);

export { MONGODB_URI, PORT, WS_PORT };
