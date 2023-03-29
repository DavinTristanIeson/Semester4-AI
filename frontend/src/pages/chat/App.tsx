import { useParams } from 'react-router-dom';
import ChatMembers from './ChatMembers';
import ChatMessages from './ChatMessages';

import "./chat.css";
import { createContext, CSSProperties, useState } from 'react';
import { Chatroom, UserAccount } from '../../helpers/classes';
import { ChatroomContext, CurrentUserContext } from './context';
import { BackButton } from '../../components/Buttons';
import ChatOptions from './ChatOptions';

function App(){
    const { id } = useParams();
    const currentUser = new UserAccount(9, "davin@email.com", "DavinTristan", "Nama saya Davin", "none");
    const chatroom = new Chatroom(1, Array.from({length: 10}, (_, i) => i+1).map(x => new UserAccount(x, "davin@email.com", "DavinTristan", "Nama saya Davin", "none")), {
        title: "Chatroom",
        thumbnail: "",
        description: "Hallo",
        isToxicityFiltered: true,
        isPublic: false,
    });
    const [isOptionsOpen, letOptionsOpen] = useState(false);
    function onClose(){
        letOptionsOpen(false);
    }
    return <CurrentUserContext.Provider value={currentUser}>
        <ChatroomContext.Provider value={chatroom}>
            <BackButton/>
            <div className="d-flex justify-content-stretch mt-4 mx-3">
                <ChatMessages/>
                <ChatMembers onOpenSettings={()=>letOptionsOpen(true)}/>
            </div>
            {isOptionsOpen && <ChatOptions onClose={()=>letOptionsOpen(false)}/>}
        </ChatroomContext.Provider>
    </CurrentUserContext.Provider>
}

export default App;