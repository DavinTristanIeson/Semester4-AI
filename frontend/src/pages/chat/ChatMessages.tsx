import { useContext, useEffect, useRef, useState } from "react";
import { Message, UserAccount } from "../../helpers/classes";
import { MemberIcon } from "./ChatMembers";
import { ChatroomContext, CurrentUserContext } from "./context";

interface RequireMessage {
    message:Message
}
function ChatMessage({message}:RequireMessage){
    const currentUser = useContext(CurrentUserContext);
    return <div className={`chat-message my-2 py-2 ps-3 ${(currentUser?.id == message.user.id ? "bg-highlight-dark" : "bg-highlight")}`}>
        <div className="d-flex align-items-center justify-content-between me-3">
            <div className="d-flex align-items-center">
                <MemberIcon user={message.user}/>
                <h5 className="ms-2 m-0">{message.user.username}</h5>
            </div>
            <p className="fw-light">{message.waktu}</p>
        </div>
        {message.message}
    </div>
}

interface ChatInputProps {
    addMessage(msg:Message):void;
}
function ChatInput({addMessage}:ChatInputProps){
    const [input, setInput] = useState("");
    const currentUser = useContext(CurrentUserContext);
    function onChange(e:React.ChangeEvent<HTMLTextAreaElement>){
        setInput(e.target.value);
    }
    function detectEnter(e:React.KeyboardEvent<HTMLTextAreaElement>){
        if (e.key != "Enter") return;
        else if (e.shiftKey) return;
        addMessage(new Message(Math.random(), currentUser!, input, new Date()));
        setInput("");
        e.preventDefault();
        // TODO: send message
    }
    return <textarea className="chat-input" placeholder="Pesan Anda" value={input} onChange={onChange} onKeyDown={detectEnter}>
    </textarea>
}

function ChatMessages(){
    function createPlaceholders(start:number = 0){
        return Array.from({length: 20}, (_, i) => i+1).map(x => new Message(x+start, new UserAccount(x+start, "davin@email.com", "DavinTristan", "Nama saya Davin", "none"), "Hallo", new Date()));
    }
    const [messages, setMessages] = useState(createPlaceholders());
    const [hasNewMessage, letNewMessage] = useState(false);
    const scrollContainer = useRef<HTMLDivElement>(null);
    const chatroom = useContext(ChatroomContext);
    function reduceMessages(){
        if (messages.length > 200){
            setMessages(msg => msg.slice(msg.length-200));
        }
    }
    function addMessage(newMsg:Message){
        setMessages(msg => [...msg, newMsg]);
        reduceMessages();
        letNewMessage(true);
    }
    useEffect(()=>{
        if (!scrollContainer.current) return;
        scrollContainer.current.scrollTop = scrollContainer.current.scrollHeight;
    }, []);
    return <div className="col-9 chat-messages-list bg-white me-2 p-3 position-relative">
        <h2 className="text-center">{chatroom?.settings.title}</h2>
        <div className="overflow-y-scroll h-screen mb-2" ref={scrollContainer}>
            { messages.map(msg => <ChatMessage message={msg} key={msg.id}/>)}
        </div>
        <ChatInput addMessage={addMessage}/>
    </div>
}
export default ChatMessages;