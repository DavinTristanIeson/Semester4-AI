import { createContext } from "react";
import { Chatroom, ChatroomInfo, UserAccount } from "./helpers/classes";

export const CurrentUserContext = createContext<UserAccount|undefined>(undefined);
export const ChatroomContext = createContext<Chatroom|undefined>(undefined);
export const PublicChatroomsContext = createContext<{
    mine:ChatroomInfo[],
    public:ChatroomInfo[],
    setMine: React.Dispatch<React.SetStateAction<ChatroomInfo[]>>,
    setPublic: React.Dispatch<React.SetStateAction<ChatroomInfo[]>>,
}|undefined>(undefined);