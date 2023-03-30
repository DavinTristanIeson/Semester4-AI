import { useContext, useState } from "react";
import { CurrentUserContext, PublicChatroomsContext } from "../../context";
import { Chatroom, ChatroomInfo, UserAccount } from "../../helpers/classes";
import { ChatroomItem, ChatroomJoinDetail, ChatroomListItem } from "./ChatroomItem";
import { KeyboardEvent, FocusEvent } from "react";
import "./home.css";
import { MaybeImage } from "../../components/Image";
import { DangerButton } from "../../components/Buttons";
import { useNavigate } from "react-router-dom";

function SearchView({searchTerm}:{searchTerm:string}){
    const [viewedChatroom, setViewedChatroom] = useState<ChatroomInfo|null>(null);
    const context = useContext(PublicChatroomsContext); // hanya untuk debug

    const [chatrooms, setChatrooms] = useState<ChatroomInfo[]>(updateSearch());
    function updateSearch(){
        // TODO: query backend
        return context!.public.filter(x => x.settings.title.startsWith(searchTerm))
    }
    
    return <>
        {viewedChatroom && <ChatroomJoinDetail onClose={() => setViewedChatroom(null)} chatroom={viewedChatroom}/>}
        <div className="vertical-scroll">
            {chatrooms.map(x => <ChatroomListItem chatroom={x} onOpen={setViewedChatroom}/>)}
        </div>
    </>
}

function MainView(){
    const chatrooms = useContext(PublicChatroomsContext);
    const [viewedChatroom, setViewedChatroom] = useState<ChatroomInfo|null>(null);
    
    return <>
        {viewedChatroom && <ChatroomJoinDetail onClose={() => setViewedChatroom(null)} chatroom={viewedChatroom}/>}
        <h2>Ruangan Saya</h2>
        <div className="horizontal-scroll">
            {chatrooms?.mine.map(x => <ChatroomItem chatroom={x} key={x.id} onOpen={setViewedChatroom}/>)}
        </div>
        <hr className="my-5"/>
        <h2>Ruangan Publik</h2>
        <div className="horizontal-scroll">
            {chatrooms?.public.map(x => <ChatroomItem chatroom={x} key={x.id} onOpen={setViewedChatroom}/>)}
        </div>
    </>
}

function App(){
    const [searchTerm, setSearchTerm] = useState("");
    const [displayedSearchTerm, setDisplayedSearchTerm] = useState("");

    const currentUser = new UserAccount(9, "davin@email.com", "DavinTristan", "Nama saya Davin", "none");
    const [myChatrooms, setMyChatrooms] = useState(Array.from({length: 10}, (_, i) => i+1).map(x => new ChatroomInfo(
        x, new UserAccount(x, "davin@email.com", "DavinTristan", "Nama saya Davin", "none"),
        Math.floor(Math.random()*200+20),
        true,
        {
            title: "Chatroom",
            thumbnail: "",
            description: "Hallo",
            isToxicityFiltered: true,
            isPublic: false,
        })
    ));
    const [publicChatrooms, setPublicChatrooms] = useState(myChatrooms.map(x => new ChatroomInfo(x.id, x.owner, x.memberCount, false, x.settings)));
    const chatrooms = {
        mine: myChatrooms,
        public: publicChatrooms,
        setMine: setMyChatrooms,
        setPublic: setPublicChatrooms,
    };


    const navigate = useNavigate();
    function logout(){
        navigate("/login", {replace: true});
    }
    function toProfile(){
        navigate("/account");
    }
    
    return <CurrentUserContext.Provider value={currentUser}>
        <PublicChatroomsContext.Provider value={chatrooms}>
        <div className="mx-5 mt-3">
            <div className="d-flex align-items-center mb-5">
                <input type="search" placeholder="Search" className="search-bar thick-shadow"
                value={displayedSearchTerm}
                onChange={e => setDisplayedSearchTerm(e.target.value)}
                onKeyUp={e => {
                    if (e.key == "Enter"){
                        setSearchTerm((e.target as HTMLInputElement).value);
                    }
                }}
                onBlur={e => setSearchTerm(e.target.value)}/>
                <MaybeImage className="icon-circle ms-5" src={currentUser.pfp} alt={currentUser.username}
                onClick={toProfile}/>
                <DangerButton onClick={logout}>Logout</DangerButton>
            </div>
            { searchTerm.length == 0 ? <MainView/> : <SearchView searchTerm={searchTerm}/>}
        </div>
        </PublicChatroomsContext.Provider>
    </CurrentUserContext.Provider>
}

export default App;