const {Pool} = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
     ssl: {
        require: true,
        rejectUnauthorized: false, // required for Supabase external connections
    },
})

module.exports = pool;