const pool = require('../config/db');
const generateCode = require('../utils/generateCode');

// Helper: safely run queries
async function runQuery(query, params = []) {
  try {
    const result = await pool.query(query, params);
    return { success: true, rows: result.rows, rowCount: result.rowCount };
  } catch (err) {
    console.error("DB Query Error:", err);
    return { success: false, error: err };
  }
}

// ------------------------------
// CREATE SHORT LINK
// ------------------------------
const createLink = async (code, target)=> {
    const finalCode = code || generateCode();

    const insertQuery = `
        INSERT INTO links (code, target_url)
        VALUES ($1, $2)
        RETURNING *
    `;

    const result = await runQuery(insertQuery, [finalCode, target]);

    // Unique constraint violation
    if (!result.success && result.error && result.error.code === "23505") {
        return { success: false, conflict: true };
    }

    if (!result.success) {
        return { success: false, error: "db_error" };
    }

    return { success: true, data: result.rows[0] };
}



// ------------------------------
// GET ALL LINKS
// ------------------------------
async function getAllLinks() {
    const query = `
        SELECT code, target_url AS target, clicks, last_clicked, created_at
        FROM links
        ORDER BY created_at DESC
    `;

    const result = await runQuery(query);

    if (!result.success) return [];
    return result.rows;
}

// ------------------------------
// GET STATS FOR A LINK
// ------------------------------
const getLinkStats = async(code)=>{
    const query = `
        SELECT code, target_url AS target, clicks, last_clicked, created_at
        FROM links
        WHERE code = $1
    `;

    const result = await runQuery(query, [code]);

    if (!result.success || result.rowCount === 0) return null;
    return result.rows[0];
}

// ------------------------------
// DELETE A LINK
// ------------------------------
const  deleteLink = async (code)=>{
  const query = `DELETE FROM links WHERE code = $1`;

  const result = await runQuery(query, [code]);

  if (!result.success) return false;
  return result.rowCount > 0;
}


// ------------------------------
// REDIRECT + INCREMENT CLICKS
// ------------------------------
const handleRedirect = async (code)=> {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const selectRes = await client.query(
            "SELECT target_url FROM links WHERE code = $1 FOR UPDATE",
            [code]
        );

        if (selectRes.rowCount === 0) {
            await client.query("ROLLBACK");
            return null;
        }

        const target = selectRes.rows[0].target_url;

        await client.query(
            "UPDATE links SET clicks = clicks + 1, last_clicked = NOW() WHERE code = $1",
            [code]
        );

        await client.query("COMMIT");
        return target;
    
    } catch (err) {
        console.error("Redirect Transaction Error:", err);
        await client.query("ROLLBACK");
        return null;
    } finally {
        client.release();
    }
}

module.exports = {
  createLink,
  getAllLinks,
  getLinkStats,
  deleteLink,
  handleRedirect,
};