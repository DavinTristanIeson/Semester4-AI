import { STORAGE } from "./constants";

export class UserAccount {
    readonly id:number;
    name:string;
    email:string;
    bio:string;
    pfp:string;
    constructor(id:number, email:string, name:string, bio:string, pfp:string){
        this.id = id;
        this.name = name;
        this.email = email;
        this.bio = bio;
        this.pfp = pfp;
    }
    static fromJSON(json:any){
        return new UserAccount(json.id, json.email, json.name, json.bio, STORAGE + json.pfp);
    }
}

export class Message {
    readonly id:number;
    user:UserAccount;
    message:string;
    time:Date;
    constructor(id:number, user:UserAccount, message:string, time:Date){
        this.id = id;
        this.user = user;
        this.message = message;
        this.time = time;
    }
    get waktu(){
        return this.time.toLocaleString();
    }
}


export interface ChatroomSettings {
    title:string;
    thumbnail:string;
    description:string;
    isToxicityFiltered:boolean;
    isPublic:boolean;
}
export class ChatroomInfo {
    // Untuk ditampilkan di halaman /home
    readonly id:number;
    owner:UserAccount;
    memberCount:number;
    hasJoined:boolean;
    settings:ChatroomSettings
    constructor(id:number, owner:UserAccount, memberCount:number, hasJoined:boolean, settings:ChatroomSettings){
        this.id = id;
        this.owner = owner;
        this.memberCount = memberCount;
        this.hasJoined = hasJoined;
        this.settings = settings;
    }
}

export class Chatroom {
    readonly id:number;
    readonly owner:UserAccount;
    members:UserAccount[];
    settings:ChatroomSettings;
    constructor(id:number, owner:UserAccount, members:UserAccount[], settings:ChatroomSettings){
        this.id = id;
        this.owner = owner;
        this.members = members;
        this.settings = settings;
    }
}