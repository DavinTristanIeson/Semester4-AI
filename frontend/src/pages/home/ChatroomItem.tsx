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
            <p className="fw-light">owned by {chatroom.owner.username}</p>
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
                <p className="fw-light">owned by {chatroom.owner.username}</p>
                <p className="border-start ps-4">{chatroom.settings.description}</p>
                <div className="form-check">
                    <label
                        className="form-check-label"
                        htmlFor="chatroom-join-detail-is-filtered-checkbox"
                    >Delete Toxic Messages</label>
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
            <PrimaryButton onClick={joinChatroom} className="w-25">Join</PrimaryButton>
            { chatroom.hasJoined && chatroom.owner.id != currentUser?.id && <DangerButton onClick={leaveChatroom} className="w-25">Leave</DangerButton> }
            <button className="btn btn-secondary m-2 p-2 w-25" onClick={onClose}>Cancel</button>
        </div>
    </div>
}

export function CreateNewChatroom({onClose}:CloseChatroomDetail){
    const [isValidating, letValidating] = useState(false);
    const navigate = useNavigate();
    const inputs = [
        new TextInputObject("Chatroom Title", "", validateChatroomTitle),
        new TextInputObject("Chatroom Description", "", noValidate, {
            isTextarea: true,
        }),
        new FileInputObject("Chatroom Thumbnail", x => x ? "" : "Chatroom thumbnail is required", {
            accept: "image/*"
        }),
        new CheckboxInputObject("Settings", [], [
            {label: "Delete Toxic Messages", value:"filtered"},
            {label: "Public Chatroom", value:"public"}
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
                Create New Chatroom
            </PrimaryButton>
            <button className="btn btn-secondary m-2 p-2 w-25"
            onClick={onClose}>
                Cancel
            </button>
        </div>
    </div>
}