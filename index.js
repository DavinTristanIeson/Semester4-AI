const express = require("express");
const app = express();
const session = require("express-session");

const AccountRouter = require("./api/account");
const ChatRouter = require("./api/chat");
const { auth } = require("./api/middleware");

const cors = require("cors");
const SQLiteStore = require("connect-sqlite3")(session);

const PORT = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
const sessionMiddleware = session({
  store: new SQLiteStore(),
  secret: "yoursecretkey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 3600 * 1000,
    secure: false,
    path: "/",
    sameSite: "lax",
    httpOnly: true,
  },
});
app.use(sessionMiddleware);
app.use("/accounts", AccountRouter);
app.use("/chatroom", auth, ChatRouter);

app.use((err, req, res, next) => {
  console.log(err.stack);
  if (!res.headersSent) {
    res.status(500).json({
      message:
        "Terjadi kesalahan di bagian server, mohon dicoba lagi pada waktu lain",
    });
  }
});

app.get("/", (req, res) => {});

app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
});