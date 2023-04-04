import { useParams } from 'react-router-dom';
import ChatMembers from './ChatMembers';
import ChatMessages from './ChatMessages';

import "./chat.css";
import { createContext, CSSProperties, useEffect, useState } from 'react';
import { Chatroom, UserAccount } from '../../helpers/classes';
import { ChatroomContext, CurrentUserContext } from '../../context';
import { BackButton } from '../../components/Buttons';
import ChatOptions from './ChatOptions';
import { useInformativeFetch } from '../../helpers/fetch';
import { API } from '../../helpers/constants';
import { Loading } from '../../components/Informative';

function App(){
    const { id } = useParams();
    const infoFetch = useInformativeFetch();
    const [chatroom, setChatroom] = useState<Chatroom|null>(null);
    useEffect(() => {
        try {
            infoFetch(() => fetch(API + "/chatroom/" + id, { credentials: "include"}))
                .then(res => res.json())
                .then(json => setChatroom(Chatroom.fromJSON(json)));
        } catch (e) {}
    }, []);
    const [isOptionsOpen, letOptionsOpen] = useState(false);
    return <ChatroomContext.Provider value={{room: chatroom, setRoom: setChatroom}}>
        <BackButton/>
        <Loading dependency={chatroom}>
            <div className="d-flex justify-content-stretch mt-4 mx-3">
                <ChatMessages/>
                <ChatMembers onOpenSettings={()=>letOptionsOpen(true)}/>
            </div>
        </Loading>
        {isOptionsOpen && <ChatOptions onClose={()=>letOptionsOpen(false)}/>}
    </ChatroomContext.Provider>
}

export default App;