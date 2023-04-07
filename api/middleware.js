const db = require("./db");

module.exports = {
  auth(req, res, next) {
    if (req.session.user) next();
    else res.status(401).end();
  },
  // Assumes that req.params.id is the id of the chatroom, and req.session.id is the id of the user
  // Use alongside auth
  async hasUserJoined(req, res, next){
    const isMember = await db.get("SELECT * FROM user_rooms WHERE user_id = ? AND room_id = ?", [req.session.user.id, req.params.id]);
    if (isMember) next();
    else res.status(401).end();
  },
  async doesChatroomExist(req, res, next){
    const doesExist = await db.get("SELECT * FROM rooms WHERE id = ?", [req.params.id]);
    if (doesExist) next();
    else res.status(404).end();
  },
  async isChatroomOwner(req, res, next){
    const { owner_id } = await db.get("SELECT rooms.owner_id FROM user_rooms JOIN rooms ON rooms.id = user_rooms.room_id WHERE user_id = ? AND room_id = ?", [req.session.user.id, req.params.id]);
    if (owner_id == req.session.user.id) next();
    else res.status(401).end();
  },
  createUserObject(user){
    return {id: user.id, email: user.email, name: user.name, bio: user.bio, pfp: user.pfp_path};
  },
  createChatroomInfoObject(chatroom){
    return {
      id: chatroom.room_id,
      owner: {
        id: chatroom.owner_id,
        email: chatroom.owner_email,
        name: chatroom.owner_name,
        bio: chatroom.owner_bio,
        pfp: chatroom.owner_pfp,
      },
      settings: {
        title: chatroom.title,
        thumbnail: chatroom.thumbnail,
        description: chatroom.description,
        isToxicityFiltered: !!chatroom.is_filtered,
        isPublic: !!chatroom.is_public,
      }
    }
  },
  createChatroomObject(chatroom, members){
    const users = members.map(user => ({id: user.id, email: user.email, name: user.name, bio: user.bio, pfp: user.pfp_path}));
    return {
        id: chatroom.room_id,
        owner: {
          id: chatroom.owner_id,
          email: chatroom.owner_email,
          name: chatroom.owner_name,
          bio: chatroom.owner_bio,
          pfp: chatroom.owner_pfp,
        },
        members: users,
        settings: {
          title: chatroom.title,
          thumbnail: chatroom.thumbnail,
          description: chatroom.description,
          isToxicityFiltered: !!chatroom.is_filtered,
          isPublic: !!chatroom.is_public,
        }
    }
  }
};
