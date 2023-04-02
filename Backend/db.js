const express = require("express");

const { SQLitePromise } = require("./SQLitePromise");

async function main(db) {
  await db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    bio TEXT,
    pfp_path TEXT,
    joined_room TEXT
    );
    CREATE TABLE IF NOT EXISTS rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_name TEXT NOT NULL,
      ownerID TEXT NOT NULL,
      members TEXT NOT NULL,
      settings TEXT,
      isPublic TEXT
      );
  `);
}

const db = new SQLitePromise("./backend.db");
main(db);

module.exports = db;
