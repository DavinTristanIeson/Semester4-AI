const multer = require("multer");
const fs = require("fs/promises");
const path = require("path");

// Konfigurasi multer untuk menyimpan file ke dalam folder 'storage'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../storage"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// Route handler untuk menghandle upload file dan update path di database
app.post("/profile", upload.single("pfp"), async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await db.get("SELECT * FROM users WHERE id = ?", userId);

    // Hapus file lama jika ada
    if (user.pfp_path) {
      const oldFilePath = path.join(__dirname, "../storage", user.pfp_path);
      if (
        await fs
          .access(oldFilePath)
          .then(() => true)
          .catch(() => false)
      ) {
        await fs.unlink(oldFilePath);
      }
    }

    // Simpan gambar baru dan update path di database
    await db.run("UPDATE users SET pfp_path = ? WHERE id = ?", [
      req.file.originalname,
      userId,
    ]);

    res.json({ message: "Profile picture updated successfully" });
  } catch (err) {
    console.error(`Error updating profile picture: ${err}`);
    res.status(500).json({ error: "Failed to update profile picture" });
  }
});
