const { Pool } = require("pg");
require("dotenv").config();


const pgPool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || process.env.DB_DATABASE,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
  max: Number(process.env.DB_POOL_MAX || 10),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

pgPool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error.message);
});

const camelCaseKeys = {
  passwordhash: "passwordHash",
  createdat: "createdAt",
  companyname: "companyName",
  postalcode: "postalCode",
  filepath: "filePath"
};

function normalizeRows(rows) {
  return rows.map((row) => {
    const normalized = {};
    for (const [key, value] of Object.entries(row)) {
      normalized[camelCaseKeys[key] || key] = value;
    }
    return normalized;
  });
}

function translateQuery(source, suppliedInputs) {
  let text = String(source).trim().replace(/;\s*$/, "");
  const isRowCountQuery = /;\s*SELECT\s+@@ROWCOUNT\s+AS\s+affectedRows\s*;?$/i.test(source.trim());
  text = text.replace(/;\s*SELECT\s+@@ROWCOUNT\s+AS\s+affectedRows\s*;?$/i, "");
  text = text.replace(/;\s*$/, "");

 
  let returningColumns = null;
  const outputMatch = text.match(/\bOUTPUT\s+((?:(?:INSERTED|DELETED)\.[A-Za-z_*][A-Za-z0-9_*]*)(?:\s*,\s*(?:(?:INSERTED|DELETED)\.[A-Za-z_*][A-Za-z0-9_*]*))*)/i);
  if (outputMatch) {
    returningColumns = outputMatch[1]
      .split(",")
      .map((column) => column.trim().replace(/^(?:INSERTED|DELETED)\./i, ""))
      .join(", ");
    text = text.replace(outputMatch[0], "");
  }

  
  const hasTopOne = /\bSELECT\s+TOP\s+1\b/i.test(text);
  text = text.replace(/\bSELECT\s+TOP\s+1\b/i, "SELECT");

  if (isRowCountQuery && !returningColumns) {
    returningColumns = "id";
  }
  if (returningColumns) {
    text = `${text.trim()} RETURNING ${returningColumns}`;
  } else if (hasTopOne) {
    text = `${text.trim()} LIMIT 1`;
  }

  const values = [];
  const placeholderIndexes = new Map();
  text = text.replace(/@([A-Za-z_][A-Za-z0-9_]*)/g, (_match, name) => {
    if (!placeholderIndexes.has(name)) {
      placeholderIndexes.set(name, values.length + 1);
      values.push(suppliedInputs.has(name) ? suppliedInputs.get(name).value : undefined);
    }
    return `$${placeholderIndexes.get(name)}`;
  });

  return { text, values, isRowCountQuery };
}

class RequestCompat {
  constructor(pool) {
    this.pool = pool;
    this.inputs = new Map();
  }

  input(name, _type, value) {
    this.inputs.set(name, { value });
    return this;
  }

  async query(sqlText) {
    const translated = translateQuery(sqlText, this.inputs);
    try {
      const result = await this.pool.query(translated.text, translated.values);
      if (translated.isRowCountQuery) {
        return {
          recordset: [{ affectedRows: result.rowCount }],
          rowsAffected: [result.rowCount]
        };
      }
      return {
        recordset: normalizeRows(result.rows),
        rowsAffected: [result.rowCount]
      };
    } catch (error) {
      
      if (error.code === "23505") error.number = 2627;
      throw error;
    }
  }
}

const poolCompat = {
  request() {
    return new RequestCompat(pgPool);
  },
  query(sqlText, values) {
    return pgPool.query(sqlText, values);
  },
  close() {
    return pgPool.end();
  },
  end() {
    return pgPool.end();
  }
};

const poolPromise = pgPool.query("SELECT 1")
  .then(() => {
    console.log("Connected to PostgreSQL");
    return poolCompat;
  })
  .catch((error) => {
    console.error("PostgreSQL connection failed:", error.message);
    throw error;
  });


const sql = {
  Int: "integer",
  MAX: -1,
  NVarChar: () => "text"
};

module.exports = { sql, poolPromise };
