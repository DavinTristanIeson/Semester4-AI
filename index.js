const express = require("express");
const app = express();
const session = require("express-session");

const AccountRouter = require("./api/account");
const ChatRouter = require("./api/chat");
const { auth } = require("./api/middleware");
const fs = require("fs/promises");
(async function(){
  if (!(await fs.access("./storage").then(()=>true).catch(()=>false))){
    fs.mkdir("./storage");
  }
})();

const cors = require("cors");
const SQLiteStore = require("connect-sqlite3")(session);

const PORT = 3000;
const WHITELISTED_URL = "http://localhost:5173";

app.use(cors({
  origin: WHITELISTED_URL,
  credentials: true
}));
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
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(sessionMiddleware);
app.use("/api/accounts", AccountRouter);
app.use("/api/chatroom", auth, ChatRouter);
app.get('/storage/:filename', async (req, res)=>{
	const filename = "./storage/" + req.params.filename;
	if (await fs.exists(filename)){
		res.download(filename);
	} else {
		res.status(404).end();
	}
});

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