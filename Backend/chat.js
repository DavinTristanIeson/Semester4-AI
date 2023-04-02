const express = require("express");
const { search } = require("./account");
const router = express.Router();
const db = require("./db.js");

router.get("/chatroom/:id", async (req, res) => {
    try {
        const roomid = req.params.id;
        const room = await db.get("SELECT * FROM chatrooms WHERE id = ?", [roomid]);
        member = JSON(room.members)
        isMember = false
        member.forEach(e => {
            if (req.session.user.email == e) {
                isMember = true
            }
        })
        if (!room) {
            res.status(401).json({ message: "Room tidak ada!" });
            return;
        } else if (isMember) {
            res.send(room)
        } else if (!isMember) {
            res.status(400).json({ message: "Bukan Member" })
        }
    }
    catch (err) { next(err); }
});

router.get("/chatroom/:id/settings", async(req, res) => {
    const roomDetail=await db.get("SELECT * FROM chatrooms WHERE id = ?", [roomid]);
    const isOwner = req.session.user.id === roomDetail.ownerID
    if(isOwner){

    }else{
        
    }
});

router.get("/chatroom/mine", (req, res) => {
    const rooms = JSON(req.session.user.joined_room)
    const listRooms = []
    rooms.forEach(async (e) => {
        detail = await db.get("SELECT * FROM chatrooms WHERE id = ?", [e])
        listRooms.push(detail)
    })
    res.send(listRooms)
})

router.get("/chatroom/public", async (req, res) => {
    publicRooms = await db.get("SELECT * FROM chatrooms WHERE isPublic = true")
    searchs = req.query.search || ""
    result = []
    publicRooms.forEach(e => {
        if (e.rooms_name.toString().includes(searchs)) {
            result.push(e)
        }
    })
    res.send(JSON(result))
})

router.post("/chatroom/:id", async (req, res) => {
    try {
        const roomid = req.params.id;
        const room = await db.get("SELECT * FROM chatrooms WHERE id = ?", [roomid]);
        member = JSON(room.members)
        isMember = false
        member.forEach(e => {
            if (req.session.user.email == e) {
                isMember = true
            }
        })
        if (!room) {
            res.status(401).json({ message: "Room tidak ada!" });
            return;
        } else if (!isMember) {
            const member = JSON(room.members)
            member.push(req.session.user.id)
            const joined = JSON(req.session.joined_room)
            joined.push(roomid)
            await db.run(`
UPDATE rooms
SET members = ?
WHERE id = ?;
UPDATE users
SET joined_rooms = ?
WHERE id = ?;
            `, [member, roomid, roomid, req.session.user.id])
        } else if (isMember) {
            res.status(400).json({ message: "Memang sudah jadi MEMBER!" })
        }
    }
    catch (err) { next(err); }
});

router.delete("/chatroom/:id",async (req,res)=>{
    const roomid = req.params.id
    const roomDetail = await db.get("SELECT * FROM chatrooms WHERE id = ?", [roomid]);
    if(req.session.user.id===roomDetail.ownerID){
        res.status(200)
    }else{
        res.status(401)
    }
});

router.put("/chatroom/:id",async (req,res)=>{
    const roomDetail=await db.get("SELECT * FROM chatrooms WHERE id = ?", [roomid]);
    const isOwner = req.session.user.id === roomDetail.ownerID
    if(isOwner){

    }else{

    }
});