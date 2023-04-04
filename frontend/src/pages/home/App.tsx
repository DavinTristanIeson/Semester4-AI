import { useContext, useEffect, useState } from "react";
import { CurrentUserContext, PageStateContext, PublicChatroomsContext } from "../../context";
import { Chatroom, ChatroomInfo, UserAccount } from "../../helpers/classes";
import { ChatroomItem, ChatroomJoinDetail, ChatroomListItem, CreateNewChatroom } from "./ChatroomItem";
import { KeyboardEvent, FocusEvent } from "react";
import "./home.css";
import { MaybeImage } from "../../components/Image";
import { DangerButton, PrimaryButton } from "../../components/Buttons";
import { useNavigate } from "react-router-dom";

import Add from "../../assets/add.svg";
import { API, CONNECTION_ERROR, SERVER_ERROR } from "../../helpers/constants";
import { Loading } from "../../components/Informative";

function SearchView({searchTerm}:{searchTerm:string}){
    const [viewedChatroom, setViewedChatroom] = useState<ChatroomInfo|null>(null);
    const context = useContext(PublicChatroomsContext); // hanya untuk debug

    const [chatrooms, setChatrooms] = useState<ChatroomInfo[]>(updateSearch());
    function updateSearch(){
        // TODO: query backend
        return context!.public.filter(x => x.settings.title.startsWith(searchTerm))
    }
    
    return <>
        {viewedChatroom && <ChatroomJoinDetail hasJoined={false} onClose={() => setViewedChatroom(null)} chatroom={viewedChatroom}/>}
        <div className="vertical-scroll">
            {chatrooms.map(x => <ChatroomListItem chatroom={x} onOpen={setViewedChatroom}/>)}
        </div>
    </>
}

function NewChatroomButton({onClick}:{onClick:(e:React.MouseEvent<HTMLButtonElement>)=>void}){
    return <PrimaryButton className="h-auto px-5" onClick={onClick}>
        <img src={Add} alt="Add New Chatroom"/>
    </PrimaryButton>
}

function MainView(){
    const chatrooms = useContext(PublicChatroomsContext);
    const [viewedChatroom, setViewedChatroom] = useState<{
        room: ChatroomInfo|null,
        isNew:boolean,
        hasJoined: boolean
    }|null>(null);
    
    return <>
        {viewedChatroom && (
            viewedChatroom.isNew ?
            <CreateNewChatroom onClose={()=>setViewedChatroom(null)}/> :  
            <ChatroomJoinDetail hasJoined={viewedChatroom.hasJoined} onClose={() => setViewedChatroom(null)} chatroom={viewedChatroom.room!}/>
        )}
        <h2>My Chatrooms</h2>
        <div className="horizontal-scroll">
            <NewChatroomButton onClick={()=>setViewedChatroom({room: null, isNew: true, hasJoined: false})}/>
            {chatrooms?.mine.map(x => <ChatroomItem chatroom={x} key={x.id} onOpen={e => setViewedChatroom({room: e, isNew: false, hasJoined: true})}/>)}
        </div>
        <hr className="my-5"/>
        <h2>Public Chatrooms</h2>
        <div className="horizontal-scroll">
            {chatrooms?.public.map(x => <ChatroomItem chatroom={x} key={x.id} onOpen={e => setViewedChatroom({room: e, isNew: false, hasJoined: false})}/>)}
        </div>
    </>
}

function App(){
    const [searchTerm, setSearchTerm] = useState("");
    const [displayedSearchTerm, setDisplayedSearchTerm] = useState("");

    const user = useContext(CurrentUserContext);
    const [myChatrooms, setMyChatrooms] = useState<ChatroomInfo[]>([]);
    const [publicChatrooms, setPublicChatrooms] = useState<ChatroomInfo[]>([]);
    const pageState = useContext(PageStateContext);
    const chatrooms = {
        mine: myChatrooms,
        public: publicChatrooms,
        setMine: setMyChatrooms,
        setPublic: setPublicChatrooms,
    };

    useEffect(()=>{
        pageState?.letLoading(true);
        try {
            fetch(API + "/chatroom/mine", {credentials: "include"})
                .then(res => {
                    if (res.ok) return res.json()
                        .then(json => setMyChatrooms(ChatroomInfo.fromJSONArray(json)))
                        .catch((e) => {
                            console.error(e);
                            pageState?.setErrMsg(SERVER_ERROR, 3000);
                        });
                    else pageState?.setErrMsg(SERVER_ERROR, 3000);
                });
            fetch(API + "/chatroom/public", {credentials: "include"})
                .then(res => {
                    if (res.ok) return res.json()
                        .then(json => setPublicChatrooms(ChatroomInfo.fromJSONArray(json)))
                        .catch((e) => {
                            console.error(e);
                            pageState?.setErrMsg(SERVER_ERROR, 3000);
                        });
                    else pageState?.setErrMsg(SERVER_ERROR, 3000);
                });
        } catch (e){
            console.error(e);
            pageState?.setErrMsg(CONNECTION_ERROR, 3000);
        }
        pageState?.letLoading(false);
    }, []);


    const navigate = useNavigate();
    async function logout(){
        pageState?.letLoading(true);
        try {
            const res = await fetch(API + "/accounts/logout", {
                method: "POST",
                credentials: "include"
            });
            pageState?.letLoading(false);
            if (res.ok){
                user?.setUser(null);
                navigate("/login", {replace: true});
            } else {
                pageState?.setErrMsg(SERVER_ERROR, 3000);
            }
        } catch (e){
            console.error(e);
            pageState?.letLoading(false);
            pageState?.setErrMsg(CONNECTION_ERROR, 3000);
        }
    }
    function toProfile(){
        navigate("/account");
    }
    
    return <PublicChatroomsContext.Provider value={chatrooms}>
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
                <Loading dependency={user?.user}>
                    <MaybeImage className="icon-circle ms-5" src={user?.user?.pfp ?? ''} alt={user?.user?.name ?? ''}
                    onClick={toProfile}/>
                </Loading>
                <DangerButton onClick={logout}>Logout</DangerButton>
            </div>
            { searchTerm.length == 0 ? <MainView/> : <SearchView searchTerm={searchTerm}/>}
        </div>
    </PublicChatroomsContext.Provider>
}

export default App;