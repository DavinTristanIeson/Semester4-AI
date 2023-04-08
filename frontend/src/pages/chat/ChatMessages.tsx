import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Message, UserAccount } from "../../helpers/classes";
import { MemberIcon } from "./ChatMembers";
import { ChatSocketContext, ChatroomContext, CurrentUserContext } from "../../context";
import { API } from "../../helpers/constants";
import { useInformativeFetch } from "../../helpers/fetch";


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
    addMessage(msg:string):void;
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
        addMessage(input);
        setInput("");
        e.preventDefault();
        // TODO: send message
    }
    return <textarea className="chat-input" placeholder="Your Message" value={input} onChange={onChange} onKeyDown={detectEnter}>
    </textarea>
}

function useInfiniteScrolling(){
    // Black magic, do not touch

    const infoFetch = useInformativeFetch();
    const chatroom = useContext(ChatroomContext);

    const [messages, setMessages] = useState<Message[]>([]);
    const [hasNewMessage, letNewMessage] = useState(false);
    async function loader(limit:number, offset?:number): Promise<Message[]> {
        if (!chatroom || !chatroom.room) return [];
        try {
            let query = `${API}/chatroom/${chatroom.room!.id}/messages?limit=${limit}`;
            if (offset !== undefined) query += `&offset=${offset}`;
            const res = await infoFetch(() => fetch(query, {
                credentials: "include"
            }));
            return (await res.json()).map((x:any) => Message.fromJSON(x));
        } catch {
            return [];
        }
    }

    // Elemen HR utk trigger resize/load
    const bottom = useRef<HTMLHRElement>(null);
    const top = useRef<HTMLHRElement>(null);

    // scroll container
    const scrollRef = useRef<HTMLDivElement|null>(null);
    // agar mencegah observe terus bottom/top berulang-ulang
    const alreadyObserved = useRef<{top: boolean, bottom: boolean}>({top: false, bottom: true});

    // simpan jumlah message yang terload, untuk menentukan seberapa scroll ke bawah
    const justHadLoadedNewMessages = useRef(0);

    const MAX_ITEMS = 40;
    const LOAD_SIZE = 40;

    const onObserved = async (entries:IntersectionObserverEntry[], observer:IntersectionObserver)=>{
        for (let entry of entries){
            if (!entry.isIntersecting){
                if (entry.target == top.current)  alreadyObserved.current.top = false;
                else if (entry.target == bottom.current) alreadyObserved.current.bottom = false;
                continue;
            }
            if (entry.target == top.current && !alreadyObserved.current.top){
                alreadyObserved.current.top = true;
                const newData = await loader(LOAD_SIZE, messages[0].id);
                if (newData.length == 0) return;
                setMessages(msg => {
                    return [...newData, ...msg]
                });

                justHadLoadedNewMessages.current = newData.length;
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
    }
    const observer = useRef<IntersectionObserver|null>(null);

    // Aku tidak tahu kenapa harus begini, kelupaan alasannya
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
        if (scrollRef.current){
            createObserver(scrollRef.current);
            if (justHadLoadedNewMessages.current) {
                // Scroll down ke bawah agar tidak langsung bawa ke paling atas, biar bisa baca message yang terload
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight * (justHadLoadedNewMessages.current / (messages.length));
                justHadLoadedNewMessages.current = 0;
            }
        }
        return cleanupObserver;
    }, [messages]);
    
    useEffect(()=>{
        // load initial data
        loader(LOAD_SIZE).then(setMessages);
    }, []);

    return {messages, setMessages, hasNewMessage, letNewMessage, bottom, top, scrollContainer, scrollRef};
}

function ChatMessages(){
    const chatroom = useContext(ChatroomContext);
    const socket = useContext(ChatSocketContext);
    const infoFetch = useInformativeFetch();
    const {messages, setMessages, hasNewMessage, letNewMessage, bottom, top, scrollContainer, scrollRef,} = useInfiniteScrolling();
    const justSentNewMessage = useRef(false);

    async function addItem(message:string){
        try {
            const res = await infoFetch(() => fetch(`${API}/chatroom/${chatroom!.room!.id}/messages`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({message}),
                credentials: "include",
            }));
            const msg = Message.fromJSON(await res.json());
            if (res.ok){
                setMessages(msgs => [...msgs, msg]);
                letNewMessage(false);
                justSentNewMessage.current = true;
            }
        } catch {}
    }
    useEffect(() => {
        if (!scrollRef.current || !justSentNewMessage.current) return;
        console.log("hi");
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        justSentNewMessage.current = false;
    }, [messages]);

    socket?.on("sendMessage", (msg) => {
        setMessages(msgs => [...msgs, Message.fromJSON(msg)]);
        letNewMessage(true);
    });

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