const express = require("express");
const router = express.Router();
const db = require("./db.js");
const { auth, hasUserJoined, createChatroomObject, doesChatroomExist, isChatroomOwner, createChatroomInfoObject } = require("./middleware");

const CHATROOM_QUERY = `SELECT rooms.id AS room_id, users.id AS owner_id, users.email AS owner_email, users.name AS owner_name, users.bio AS owner_bio, users.pfp AS owner_pfp FROM rooms JOIN users ON rooms.owner_id = users.id`;
const CHATROOM_MEMBERS_QUERY = `SELECT rooms.id AS room_id FROM user_rooms JOIN users ON user_rooms.user_id = users.id WHERE user_id = ? AND room_id = ?`;


router.get("/:id", hasUserJoined, async (req, res) => {
    try {
        const room = await db.get(CHATROOM_QUERY + " WHERE room_id = ?", [req.params.id]);
        if (!room) {
            res.status(404).json({ message: "Room tidak ada!" });
            return;
        } else {
            const members = await db.all(CHATROOM_MEMBERS_QUERY);
            res.status(200).json(createChatroomObject(room, members));
        }
    }
    catch (err) { next(err); }
});

router.get("/mine", async (req, res) => {
    try {
        const rooms = await db.all(CHATROOM_QUERY);
        res.status(200).json(rooms.map(x => createChatroomInfoObject(x)));
    } catch (err){
        next(err);
    }
})

router.get("/public", async (req, res) => {
    let publicRooms;
    const CONSTRAINTS = " LIMIT 20 ORDER BY rooms.id DESC";
    if (req.query.search){
        publicRooms = await db.all(CHATROOM_QUERY + " WHERE rooms.is_public AND rooms.room_name LIKE ?" + CONSTRAINTS, [`${req.query.search}%`]);
    } else {
        publicRooms = await db.all(CHATROOM_QUERY + CONSTRAINTS)
    }
    res.status(200).json(publicRooms.map(x => createChatroomInfoObject(x)));
});

router.post("/:id/members", doesChatroomExist, async (req, res) => {
    try {
        const hasJoined = await db.get("SELECT * FROM user_rooms WHERE room_id = ? AND user_id = ?", [req.params.id, req.session.user.id]);
        if (hasJoined){
            res.status(200).json({message: "Sudah masuk ke chatroom tersebut"});
            return;
        }
        await db.run("INSERT INTO user_rooms VALUES (?, ?)", [req.session.user.id, req.params.id]);
        res.status(201).end();     
    } catch (err) {
        next(err);
    }
});

router.delete("/:id/members", hasUserJoined, async (req, res) => {
    try {
        await db.run("DELETE FROM user_rooms WHERE user_id = ? AND room_id = ?", [req.session.user.id, req.params.id]);
        res.status(200).end();
    } catch (err){
        next(err);
    } 
});
router.delete("/:id", isChatroomOwner, async (req,res)=>{
    try {
        const roomid = req.params.id;
        await db.run("DELETE FROM rooms WHERE id = ?", [roomid]);
        res.status(200).end();
    } catch (err){
        next(err);
    }
});

router.post('/', async (req, res)=>{
    try {
        const {name, isFiltered, isPublic} = req.body;
        const {lastID} = await db.run("INSERT INTO rooms VALUES (NULL, ?, ?, ?, ?, ?)", [name, req.session.user.id, isFiltered, isPublic]);
        const room = await db.get(CHATROOM_QUERY);
        if (!room) res.status(500).end();
        else res.status(201).json(createChatroomObject(room, []));
    } catch (err){
        next(err);
    }
});

router.put("/:id", isChatroomOwner, async (req,res)=>{
    const {name, isFiltered, isPublic} = req.body;
    const query = "UPDATE rooms", params = [];
    if (name) { query += " SET room_name = ?"; params.push(name); }
    if (isFiltered) { query += " SET is_filtered = ?"; params.push(isFiltered); }
    if (isPublic) { query += " SET is_public = ?"; params.push(isPublic); }
    params.push(req.params.id);
    try {
        await db.run(query + " WHERE room_id = ?", params);
    } catch (err){
        next(err);
        return;
    }

    res.status(200).end();
});

module.exports = router;