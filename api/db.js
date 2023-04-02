const express = require("express");

const { SQLitePromise } = require("./SQLitePromise");

async function main(db) {
  await db.run(`PRAGMA foreign_keys = ON`);
  await db.run(`CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
email TEXT NOT NULL UNIQUE,
password TEXT NOT NULL,
name TEXT NOT NULL,
bio TEXT,
pfp_path TEXT
)`);
  await db.run(`CREATE TABLE IF NOT EXISTS user_rooms (
user_id INTEGER NOT NULL,
room_id INTEGER NOT NULL,
FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
FOREIGN KEY (room_id) REFERENCES rooms (id) ON UPDATE CASCADE ON DELETE CASCADE,
PRIMARY KEY (user_id, room_id))`);
  await db.run(`CREATE TABLE IF NOT EXISTS rooms (
id INTEGER PRIMARY KEY AUTOINCREMENT,
room_name TEXT NOT NULL,
owner_id TEXT NOT NULL,
is_filtered INT DEFAULT 0,
is_public INT DEFAULT 0,
FOREIGN KEY (owner_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE)`);
}

const db = new SQLitePromise("./backend.db");
main(db);

module.exports = db;
