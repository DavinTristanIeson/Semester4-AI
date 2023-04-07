import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Message, UserAccount } from "../../helpers/classes";
import { MemberIcon } from "./ChatMembers";
import { ChatroomContext, CurrentUserContext } from "../../context";

interface RequireMessage {
    message:Message
}
function ChatMessage({message}:RequireMessage){
    const currentUser = useContext(CurrentUserContext);
    return <div className={`chat-message my-2 py-2 ps-3 ${(currentUser?.user?.id == message.user.id ? "bg-highlight-dark" : "bg-highlight")}`}>
        <div className="d-flex align-items-center justify-content-between me-3">
            <div className="d-flex align-items-center">
                <MemberIcon user={message.user}/>
                <h5 className="ms-2 m-0">{message.user.name}</h5>
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
        addMessage(new Message(Math.random(), currentUser?.user!, input, new Date()));
        setInput("");
        e.preventDefault();
        // TODO: send message
    }
    return <textarea className="chat-input" placeholder="Your Message" value={input} onChange={onChange} onKeyDown={detectEnter}>
    </textarea>
}

function useInfiniteScrolling(){
    async function loader(limit:number, offset:number){
        return Array.from({length: limit}, (_, i) => i+1+offset).map(x => new Message(Math.random(), new UserAccount(Math.random(), "davin@email.com", "DavinTristan", "Nama saya Davin", "none"), Math.random().toString(), new Date()));
    }
    const [messages, setMessages] = useState<Message[]>([]);
    const [hasNewMessage, letNewMessage] = useState(false);

    const bottom = useRef<HTMLHRElement>(null);
    const top = useRef<HTMLHRElement>(null);
    const scrollRef = useRef<HTMLDivElement|null>(null);
    const alreadyObserved = useRef<{top: boolean, bottom: boolean}>({top: false, bottom: true});

    const MAX_ITEMS = 20;
    const LOAD_SIZE = 10;

    // Aku ga tahu ini useCallback semua bgmn bisa bekerja, tapi yg penting sudah bisa bekerja
    // Ga mau pikirin lagi, ampun state management utk infinite scrolling
    const onObserved = useCallback(async (entries:IntersectionObserverEntry[], observer:IntersectionObserver)=>{
        for (let entry of entries){
            if (!entry.isIntersecting){
                if (entry.target == top.current)  alreadyObserved.current.top = false;
                else if (entry.target == bottom.current) alreadyObserved.current.bottom = false;
                continue;
            }
            if (entry.target == top.current && !alreadyObserved.current.top){
                alreadyObserved.current.top = true;
                const newData = await loader(LOAD_SIZE, messages.length);
                setMessages(msg => [...newData, ...msg]);

                // Push ke bawah
                if (!scrollRef.current) return;
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight * (LOAD_SIZE / (messages.length || 1));
            } else if (entry.target == bottom.current && !alreadyObserved.current.bottom){
                alreadyObserved.current.bottom = true;
                // Reduce size
                setMessages(msg => {
                    if (msg.length > MAX_ITEMS) return msg.slice(Math.max(0, msg.length - 20))
                    else return msg;
                });
                letNewMessage(false);
            }
        }
    }, [messages]);
    const observer = useRef<IntersectionObserver|null>(null);

    const cleanupObserver = useCallback(()=>{
        if (observer.current){
            top.current && observer.current.unobserve(top.current);
            bottom.current && observer.current.unobserve(bottom.current);
        }
    }, [observer.current]);
    const createObserver = useCallback((node:HTMLElement)=>{
        cleanupObserver();
        observer.current = new IntersectionObserver(onObserved, {root: node});
        observer.current.observe(top.current!);
        observer.current.observe(bottom.current!);
    }, [onObserved]);

    // https://stackoverflow.com/questions/60476155/is-it-safe-to-use-ref-current-as-useeffects-dependency-when-ref-points-to-a-dom
    const scrollContainer = useCallback((node:HTMLDivElement) => {
        if (node == null) return;
        node.scrollTop = node.scrollHeight;
        scrollRef.current = node;
        createObserver(node);
    }, []);

    useEffect(()=>{
        if (!scrollRef.current) return cleanupObserver;
        createObserver(scrollRef.current);
        return cleanupObserver;
    }, [messages]);
    
    useEffect(()=>{
        loader(10, 0).then(setMessages);
    }, []);

    return {messages, setMessages, hasNewMessage, letNewMessage, bottom, top, scrollContainer, scrollRef};
}

function ChatMessages(){
    const chatroom = useContext(ChatroomContext);
    const {messages, setMessages, hasNewMessage, letNewMessage, bottom, top, scrollContainer, scrollRef,} = useInfiniteScrolling();

    function addItem(newMsg:Message){
        setMessages(msg => [...msg, newMsg]);
        letNewMessage(true);
    }

    return <div className="col-9 chat-messages-list bg-white me-2 p-3 position-relative">
        <h2 className="text-center">{chatroom?.room?.settings.title}</h2>
        {
            messages.length > 0 &&
            <div className="overflow-y-scroll h-screen mb-2" ref={scrollContainer}>
                <hr ref={top}/>
                { messages.map(msg => <ChatMessage message={msg} key={msg.id}/>)}
                <hr ref={bottom}/>
            </div>
        }
        {
            hasNewMessage && 
            <div className="alert alert-highlight alert-dismissible">
                <strong>There's a new message! </strong>
                <a onClick={(e)=>{
                    e.preventDefault();
                    letNewMessage(false);
                    if (!scrollRef.current) return;
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }} href='#' className="link-dark">Click to instantly go to the bottom.</a>
                <button type="button" className="btn-close"
                onClick={(e)=>{
                    e.stopPropagation();
                    letNewMessage(false);
                }}
                data-bs-dismiss="alert"
                aria-label="Close">
                </button>
            </div>
        }
        <ChatInput addMessage={addItem}/>
    </div>
}
export default ChatMessages;