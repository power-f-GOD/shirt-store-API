const { MONGODB_URI: DB_URI, PORT: P, HOST: H } = process.env;
const HOST = H || '';
const MONGODB_URI = DB_URI || '';
const PORT = +(P || 3100);

export { MONGODB_URI, PORT, HOST };
