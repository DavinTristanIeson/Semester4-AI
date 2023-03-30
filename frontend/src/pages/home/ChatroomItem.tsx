import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DangerButton, PrimaryButton } from "../../components/Buttons";
import { MaybeImage } from "../../components/Image";
import { ArbitraryInput } from "../../components/Inputs";
import { CurrentUserContext, PublicChatroomsContext } from "../../context";
import { ChatroomInfo } from "../../helpers/classes";
import { CheckboxInputObject, FileInputObject, TextInputObject } from "../../helpers/inputs";
import { noValidate, validateChatroomTitle } from "../../helpers/inputValidators";

interface ChatroomItemProps {
    chatroom:ChatroomInfo,
}
interface OpenChatroomDetail {
    onOpen: (chatroom:ChatroomInfo)=>void
}
interface CloseChatroomDetail {
    onClose: ()=>void
}
export function ChatroomItem({chatroom, onOpen}:ChatroomItemProps & OpenChatroomDetail){
    return <div className="bg-white rounded thick-shadow position-relative mx-3"
        onClick={()=>onOpen(chatroom)}>
        <MaybeImage alt={chatroom.settings.title} src={chatroom.settings.thumbnail} className="rounded w-100 h-100"/>
        <div className="position-absolute bottom-0 end-0 rounded-pill bg-highlight m-3 p-2 fw-bold">
            {chatroom.settings.title}
        </div>
    </div>
}

export function ChatroomListItem({chatroom, onOpen}:ChatroomItemProps & OpenChatroomDetail){
    return <div className="bg-white rounded thick-shadow m-3 chatroom-list-item d-flex"
    onClick={()=>onOpen(chatroom)}>
        <MaybeImage src={chatroom.settings.thumbnail} alt={chatroom.settings.title} className="rounded"/>
        <div className="ms-4 mt-3">
            <h4 className="m-0 p-0">{chatroom.settings.title}</h4>
            <p className="fw-light">dimiliki oleh {chatroom.owner.username}</p>
            <p>{chatroom.settings.description}</p>
        </div>
    </div>
}

export function ChatroomJoinDetail({chatroom, onClose}:ChatroomItemProps & CloseChatroomDetail){
    const chatrooms = useContext(PublicChatroomsContext);
    const navigate = useNavigate();
    const currentUser = useContext(CurrentUserContext);

    async function joinChatroom(){
        // TODO: send request ke backend
        navigate(`/chat/${chatroom.id}`);
    }
    async function leaveChatroom(){
        // TODO: send request ke backend
        chatrooms?.setMine(mine => mine.filter(x => x.id != chatroom.id));
        chatrooms?.setPublic(pub => [chatroom, ...pub]);
        onClose();
    }
    return <div className="very-rounded chat-options thick-shadow bg-white">
        <div className="p-4">
            <MaybeImage src={chatroom.settings.thumbnail} alt={chatroom.settings.title}/>
            <div>
                <h2 className="m-0 p-0">{chatroom.settings.title}</h2>
                <p className="fw-light">dimiliki oleh {chatroom.owner.username}</p>
                <p className="border-start ps-4">{chatroom.settings.description}</p>
                <div className="form-check">
                    <label
                        className="form-check-label"
                        htmlFor="chatroom-join-detail-is-filtered-checkbox"
                    >Hapus Pesan Toksik</label>
                    <input
                        className = "form-check-input"
                        disabled
                        type = "checkbox"
                        checked={chatroom.settings.isToxicityFiltered}
                    />
                </div>
            </div>
        </div>
        <div className="p-1 d-flex flex-row-reverse">
            <PrimaryButton onClick={joinChatroom} className="w-25">Masuk</PrimaryButton>
            { chatroom.hasJoined && chatroom.owner.id != currentUser?.id && <DangerButton onClick={leaveChatroom} className="w-25">Keluar</DangerButton> }
            <button className="btn btn-secondary m-2 p-2 w-25" onClick={onClose}>Batal</button>
        </div>
    </div>
}

export function CreateNewChatroom({onClose}:CloseChatroomDetail){
    const [isValidating, letValidating] = useState(false);
    const navigate = useNavigate();
    const inputs = [
        new TextInputObject("Judul Chatroom", "", validateChatroomTitle),
        new TextInputObject("Deskripsi Chatroom", "", noValidate, {
            isTextarea: true,
        }),
        new FileInputObject("Thumbnail Chatroom", x => x ? "" : "Harus ada thumbnail untuk chatroom", {
            accept: "image/*"
        }),
        new CheckboxInputObject("Pengaturan", [], [
            {label: "Hapus Pesan Toksik", value:"filtered"},
            {label: "Chatroom Publik", value:"public"}
        ], noValidate)
    ];
    function createNewChatroom(){
        let hasError = false;
        const responses:{[key:string]:string|File|string[]|undefined} = {};
        for (let input of inputs){
            if (input.validate())
                hasError = true;
            responses[input.label] = input.value;
        }
        letValidating(true);
        if (hasError) return;
        
        console.log(responses);
        // TODO: send new chatroom to backend
        navigate("/chat/1");
    }

    return <div className="very-rounded chat-options thick-shadow bg-white">
        <div className="p-4">
            <div>
                {inputs.map(x => <ArbitraryInput input={x} shouldValidate={isValidating} key={x.id}/>)}
            </div>
        </div>
        <div className="p-1 d-flex flex-row-reverse">
            <PrimaryButton onClick={createNewChatroom} className="w-25">
                Buat Chatroom Baru
            </PrimaryButton>
            <button className="btn btn-secondary m-2 p-2 w-25"
            onClick={onClose}>
                Batal
            </button>
        </div>
    </div>
}