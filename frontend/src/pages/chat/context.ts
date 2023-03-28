import { createContext } from "react";
import { Chatroom, UserAccount } from "../../helpers/classes";

export const CurrentUserContext = createContext<UserAccount|undefined>(undefined);
export const ChatroomContext = createContext<Chatroom|undefined>(undefined);