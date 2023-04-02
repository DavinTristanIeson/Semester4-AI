const express = require("express");
const router = express.Router();
const { auth } = require("./middleware.js");
const bcrypt = require("bcrypt");
const db = require("./db.js");

function validateRegister(req, res, next) {
  const { email, password, name, bio, pfp } = req.body;
  if (!email || !password || !name || !pfp ) {
    res.status(400).json({
      message: "Expecting the following fields: email, password, name , bio, Profile Picture",
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
router.post("/register", validateRegister, async (req, res, next) => {
  const { email, password, username, bio, pfp} = req.body;
	try {
		const saltRounds = 10;
		const hash = await bcrypt.hash(password, saltRounds);
    //ni gambar masukkin ke server n ambil locationnya saya belum paham (pfp)
		await db.run("INSERT INTO users VALUES (NULL, ?, ?, ?, ?, ?,'[]' )", [email, hash, username, bio,pfp]);
	} catch (err) {
		res.status(400).json({message: "Email tersebut sudah digunakan orang lain."});
		return;
	}

	try {
		const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
		if (!user) res.status(500).end();
		else {
			req.session.user = {id: user.id, email: user.email, bio: user.bio, pfp:user.pfp_path};
			res.status(201).json(createUserObject(user));
		}
	} catch (err){
		next(err);
	}
});

router.post("/login", async (req, res, next) => {
  try {
		const { email, password } = req.body;
		const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
		if (!user || !await bcrypt.compare(password, user.password)){
			res.status(401).json({ message: "Email atau password salah!"});
			return;
		}
		req.session.user = {id: user.id, email: user.email, bio: user.bio, pfp:user.pfp_path,joined_room:user.joined_room};
		res.status(200).json(createUserObject(user));
    res.redirect('/')
	} catch (err) {
		next(err);
	}
});

router.post("/logout", auth, (req, res) => {
  req.session.destroy();
  res.status(200).end();
});

router.get("/me", (req, res) => {
  if (req.session.user) res.status(200).json(req.session.user);
  else res.status(401).end();
});

router.get("/accounts", (req, res) => {
  if (req.session.user){
    const {id,email,pfp,bio,joined_room} = req.session.user
		res.send([id,email,pfp,bio,joined_room])
  }
  else res.status(401).end();
});

module.exports = router
