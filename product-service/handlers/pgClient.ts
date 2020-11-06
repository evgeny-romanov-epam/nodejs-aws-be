const {Client} = require('pg');

const {PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD} = process.env;
const dbOptions = {
    host: PG_HOST,
    port: PG_PORT,
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: 5000
}

export async function connect() {
    const client = new Client(dbOptions);
    await client.connect();
    return client;
}

export async function query(query: string, params?: any[]) {
    const client = new Client(dbOptions);
    try {
        await client.connect();
        return await client.query(query, params)
    } finally {
        client.end();
    }
}

export async function transaction(callback: (any) => Promise<any>) {
    const client = new Client(dbOptions);
    try {
        await client.connect();
        await client.query('BEGIN');
        await callback(client);
        await client.query('COMMIT');
    } catch (e) {
        console.log("Error occurred while making transaction", e);
        try {
            await client.query('ROLLBACK')
        } catch (rollbackError) {
            console.error('Error rolling back client', rollbackError)
        }
        throw e;
    } finally {
        client.end();
    }
}