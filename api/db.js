const express = require("express");

const { SQLitePromise } = require("./SQLitePromise");

async function main(db) {
  await db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    bio TEXT,
    pfp_path TEXT
    );
  `);
}

const db = new SQLitePromise("./backend.db");
main(db);

module.exports = db;
