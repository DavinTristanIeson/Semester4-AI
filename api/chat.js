const express = require("express");
const router = express.Router();
const db = require("./db.js");
const { auth, hasUserJoined, createChatroomObject, doesChatroomExist, isChatroomOwner, createChatroomInfoObject } = require("./middleware");
const upload = require("./pfp");
const fs = require("fs/promises");

const CHATROOM_QUERY = `SELECT rooms.id AS room_id, rooms.*, users.id AS owner_id, users.email AS owner_email, users.name AS owner_name, users.bio AS owner_bio, users.pfp_path AS owner_pfp FROM rooms JOIN users ON rooms.owner_id = users.id`;
const CHATROOM_MEMBERS_QUERY = `SELECT * FROM user_rooms JOIN users ON user_rooms.user_id = users.id WHERE room_id = ?`;

router.get("/mine", auth, async (req, res, next) => {
    const MEMBER_HAS_JOINED = " WHERE (SELECT COUNT(*) FROM user_rooms WHERE user_rooms.user_id = ? AND user_rooms.room_id = rooms.id ) > 0"
    try {
        const rooms = await db.all(CHATROOM_QUERY + MEMBER_HAS_JOINED, [parseInt(req.session.user.id)]);
        res.status(200).json(rooms.map(x => createChatroomInfoObject(x)));
    } catch (err){
        next(err);
    }
})

router.get("/public", auth, async (req, res, next) => {
    let publicRooms;
    const CONSTRAINTS = " ORDER BY room_id DESC LIMIT 20";
    const ROOM_IS_PUBLIC = " AND rooms.is_public = 1"
    const MEMBER_HAS_NOT_JOINED = " WHERE (SELECT COUNT(*) FROM user_rooms WHERE user_rooms.user_id = ? AND user_rooms.room_id = rooms.id ) = 0"
    try {
        if (req.query.search){
            publicRooms = await db.all(CHATROOM_QUERY + MEMBER_HAS_NOT_JOINED + " AND rooms.title LIKE ?" + ROOM_IS_PUBLIC + CONSTRAINTS, [req.session.user.id, `${req.query.search}%`]);
        } else {
            publicRooms = await db.all(CHATROOM_QUERY + MEMBER_HAS_NOT_JOINED + ROOM_IS_PUBLIC + CONSTRAINTS, [req.session.user.id]);
        }
    } catch (err){
        next(err);
        return;
    }
    if (publicRooms){
        res.status(200).json(publicRooms.map(x => createChatroomInfoObject(x)));
    } else {
        res.status(500).end();
    }
});

router.post("/:id/members", auth, doesChatroomExist, async (req, res, next) => {
    try {
        const hasJoined = await db.get("SELECT * FROM user_rooms WHERE room_id = ? AND user_id = ?", [req.params.id, req.session.user.id]);
        if (hasJoined){
            res.status(200).json({message: "Sudah masuk ke chatroom tersebut"});
            return;
        }
        await db.run("INSERT INTO user_rooms VALUES (?, ?)", [req.session.user.id, parseInt(req.params.id)]);
        res.status(201).end();     
    } catch (err) {
        next(err);
    }
});

router.delete("/:id/members", auth, hasUserJoined, async (req, res, next) => {
    try {
        await db.run("DELETE FROM user_rooms WHERE user_id = ? AND room_id = ?", [req.session.user.id, req.params.id]);
        res.status(200).end();
    } catch (err){
        next(err);
    } 
});

router.get("/:id", auth, hasUserJoined, async (req, res, next) => {
    try {
        const room = await db.get(CHATROOM_QUERY + " WHERE room_id = ?", [req.params.id]);
        if (!room) {
            res.status(404).json({ message: "Room tidak ada!" });
            return;
        } else {
            const members = await db.all(CHATROOM_MEMBERS_QUERY, [room.room_id]);
            res.status(200).json(createChatroomObject(room, members));
        }
    }
    catch (err) { next(err); }
});


router.delete("/:id", auth, isChatroomOwner, async (req, res, next)=>{
    try {
        const roomid = parseInt(req.params.id);
        const prev = await db.get("SELECT * FROM rooms WHERE id = ?", [roomid]);
        await db.run("DELETE FROM rooms WHERE id = ?", [roomid]);
        res.status(200).end();
        const oldFile = "./storage/" + prev.thumbnail;
        if (await fs.access(oldFile).then(()=>true).catch(()=>false)){
            await fs.unlink(oldFile);
        }
    } catch (err){
        next(err);
    }
});

router.put("/:id", upload.single("thumbnail"), auth, isChatroomOwner, async (req,res,next)=>{
    const {title, description, isFiltered, isPublic} = req.body;
    const thumbnail = req.file;
    let sets = [], params = [];
    let prev;
    try {
        prev = await db.get("SELECT * FROM rooms WHERE id = ?", [parseInt(req.params.id)]);
    } catch(e){
        next(e);
        return;
    }
    
    if (title) { sets.push("title = ?"); params.push(title); }
    if (description) { sets.push("description = ?"); params.push(description); }
    if (isFiltered) { sets.push("is_filtered = ?"); params.push(isFiltered == "yes" ? 1 : 0); }
    if (isPublic) { sets.push("is_public = ?"); params.push(isPublic == "yes" ? 1 : 0); }
    if (thumbnail){ sets.push("thumbnail = ?"); params.push(thumbnail.filename); }

    if (sets.length == 0 || params.length == 0){
        res.status(200).end();
        return;
    }
    const query = "UPDATE rooms SET " + sets.join(', ') + " WHERE id = ?";
    params.push(req.params.id);
    try {
        await db.run(query, params);
        const oldFile = "../storage/" + prev.thumbnail;
        res.status(200).end();
        if (await fs.access(oldFile).then(()=>true).catch(()=>false)){
            await fs.unlink(oldFile);
        }
    } catch (err){
        next(err);
        return;
    }
});


router.post('/', upload.single("thumbnail"), auth, async (req, res, next)=>{
    try {
        const {title, description, isFiltered, isPublic} = req.body;
        const thumbnail = req.file;
        const {lastID} = await db.run("INSERT INTO rooms VALUES (NULL, ?, ?, ?, ?, ?, ?)",
        [req.session.user.id, title, description, thumbnail.filename, isFiltered.length > 0 ? 1 : 0, isPublic.length > 0 ? 1 : 0]);
        await db.run("INSERT INTO user_rooms VALUES (?, ?)", [req.session.user.id, lastID]);
        const room = await db.get(CHATROOM_QUERY + " WHERE room_id = ?", [lastID]);
        if (!room) res.status(500).end();
        else {
            const members = await db.all(CHATROOM_MEMBERS_QUERY, [lastID]);
            res.status(201).json(createChatroomObject(room, members));
        }
    } catch (err){
        next(err);
    }
});

module.exports = router;