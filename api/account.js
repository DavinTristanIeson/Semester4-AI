const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("./db/js");
const { auth } = require("./middleware.js");

function validateRegister(req, res, next) {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    res.status(400).json({
      message: "Expecting the following fields: email, password, name",
    });
    return;
  }
  const errors = [];
  if (email.length == 0) errors.push("Email harus diisi");
  else if (
    !email.match(
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    )
  )
    errors.push("Format email tidak sesuai");

  if (password.length < 8)
    errors.push("Password harus terdiri dari minimal 8 karakter");

  if (name.length < 5)
    errors.push("Nama harus terdiri dari minimal 5 karakter");
  else if (!name.match(/^[a-zA-Z0-9]+$/))
    errors.push(
      "Nama hanya boleh terdiri dari huruf alfabet dan angka 0-9 saja"
    );

  if (errors.length > 0) {
    res.status(400).json({ message: errors.join(". ") });
    return;
  } else {
    next();
  }
}

router.post("/register", validateRegister, async (req, res, next) => {});

router.post("/login", async (req, res, next) => {});

router.post("/logout", auth, (req, res) => {
  req.session.destroy();
  res.status(200).end();
});

router.get("/me", (req, res) => {
  if (req.session.user) res.status(200).json(req.session.user);
  else res.status(401).end();
});
