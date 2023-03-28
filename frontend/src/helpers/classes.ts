export class UserAccount {
    readonly id:number;
    username:string;
    email:string;
    bio:string;
    pfp:string;
    constructor(id:number, email:string, username:string, bio:string, pfp:string){
        this.id = id;
        this.username = username;
        this.email = email;
        this.bio = bio;
        this.pfp = pfp;
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
    isToxicityFiltered:boolean;
}
export class Chatroom {
    readonly id:number;
    members:UserAccount[];
    settings:ChatroomSettings;
    constructor(id:number, members:UserAccount[], settings:ChatroomSettings){
        this.id = id;
        this.members = members;
        this.settings = settings;
    }
}