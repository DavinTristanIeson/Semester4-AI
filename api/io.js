const { Server } = require("socket.io");
const db = require("./db.js");
let io;

function initialize(httpServer, options, sessionMiddleware) {
  io = new Server(httpServer, options);

  // Middleware untuk session
  const wrap = (middleware) => (socket, next) =>
    middleware(socket.request, {}, next);
  io.use(wrap(sessionMiddleware));
  io.use((socket, next) => {
    if (socket.request.session.user) next();
    else next(new Error("Unauthorized user"));
  });

  // Event listener saat koneksi socket.io terhubung
  io.on("connection", (socket) => {
    console.log(`Socket.io client terhubung: ${socket.id}`);

    // Event listener saat user bergabung ke sebuah chatroom
    socket.on("joinRoom", (roomId) => {
      const roomIdValid = chatRooms.has(roomId); // Memeriksa apakah chatroom valid

      if (roomIdValid) {
        // Bergabung ke chatroom menggunakan ID socket sebagai identifier
        socket.join(roomId);
        console.log(`User bergabung ke chatroom: ${roomId}`);
      } else {
        console.log(`Chatroom tidak ditemukan: ${roomId}`);
      }
    });

    // Event listener untuk saat user mengirimkan pesan di sebuah chatroom
    socket.on("sendMessage", async ({ roomId, message }) => {
      const roomIdValid = chatRooms.has(roomId); // Memeriksa apakah chatroom valid

      if (roomIdValid) {
        const name = socket.request.session.user.name; // Mendapatkan name pengguna dari session
        const timestamp = new Date().toISOString(); // Mendapatkan timestamp pesan
        const room = chatRooms.get(roomId); // Mendapatkan chatroom berdasarkan ID

        await db.run(
          "INSERT INTO messages (roomId, name, message, timestamp) VALUES (?, ?, ?, ?)",
          [roomId, name, message, timestamp]
        );

        // Mengambil nilai ID pesan yang baru saja ditambahkan ke dalam tabel messages
        const result = await db.get("SELECT last_insert_rowid() as id");

        // Mengirimkan pesan ke semua anggota chatroom
        io.to(roomId).emit("newMessage", {
          // Mengganti event menjadi 'newMessage' sesuai dengan event listener pada sisi client
          id: result.id, // Menggunakan nilai ID yang dihasilkan oleh SQLite
          roomId,
          name,
          message,
          timestamp,
        });

        console.log(`Pesan baru dikirim: ${result.id}`);
      }
    });

    // Event listener saat user meninggalkan chatroom
    socket.on("leaveRoom", (roomId) => {
      const roomIdValid = chatRooms.has(roomId); // Memeriksa apakah chatroom valid

      if (roomIdValid) {
        // Menghapus pengguna dari chatroom menggunakan ID socket sebagai identifier
        socket.leave(roomId);
      }
    });

    // Event listener saat koneksi socket.io terputus
    socket.on("disconnect", () => {
      console.log(`Socket.io client terputus: ${socket.id}`);
    });
  });
}

module.exports = { initialize };
