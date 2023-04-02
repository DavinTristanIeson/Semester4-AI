import { useContext } from "react";
import { DangerButton, PrimaryButton } from "../../components/Buttons";
import { MaybeImage } from "../../components/Image";
import { ArbitraryInput } from "../../components/Inputs";
import { CheckboxInputObject, FileInputObject, TextInputObject } from "../../helpers/inputs";
import { noValidate, validateChatroomTitle } from "../../helpers/inputValidators";
import { ChatroomContext } from "../../context";
import { useNavigate } from "react-router-dom";

interface ChatOptionsProps {
    onClose: ()=>void
}

function ChatOptions({onClose}:ChatOptionsProps){
    const chatroom = useContext(ChatroomContext)!;
    const navigate = useNavigate();

    const chatroomOptions = [];
    if (chatroom.settings.isToxicityFiltered)
        chatroomOptions.push("filtered");
    if (chatroom.settings.isPublic)
        chatroomOptions.push("public");

    const inputs:[TextInputObject,TextInputObject,FileInputObject,CheckboxInputObject] = [
        new TextInputObject("Chatroom Title", chatroom.settings.title, validateChatroomTitle),
        new TextInputObject("Chatroom Description", chatroom.settings.description, noValidate, {
            isTextarea: true,
        }),
        new FileInputObject("Chatroom Thumbnail", noValidate, {
            accept: "image/*"
        }),
        new CheckboxInputObject("Settings", chatroomOptions, [
            {label: "Delete Toxic Messages", value:"filtered"},
            {label: "Public Chatroom", value:"public"}
        ], noValidate)
    ];
    function saveSettings(){
        let hasError = false;
        const responses:{[key:string]:string|string[]|File|undefined} = {};
        for (let input of inputs){
            if (input.validate()){
                hasError = true;
                return;
            }
            responses[input.label] = input.value;
        }
        console.log(responses);
        if (hasError) return;

        // TODO: Save to backend
        onClose();
    }
    function deleteChatroom(){
        if (!confirm("Are you sure you want to delete this chatroom?")) return;
        navigate("/", {replace: true});
        // TODO: send request ke backend
    }

    return <div className="very-rounded chat-options thick-shadow bg-white">
        <div className="p-4">
            <MaybeImage src={chatroom.settings.thumbnail} alt={chatroom.settings.title}/>
            <div>
                {inputs.map(x => <ArbitraryInput input={x} shouldValidate={true} key={x.id}/>)}
            </div>
        </div>
        <div className="p-1 d-flex flex-row-reverse">
            <PrimaryButton onClick={saveSettings} className="w-25">
                Save
            </PrimaryButton>
            <DangerButton onClick={deleteChatroom} className="w-25">
                Delete This Chatroom
            </DangerButton>
            <button className="btn btn-secondary m-2 p-2 w-25"
            onClick={onClose}>
                Cancel
            </button>
        </div>
    </div>
}

export default ChatOptions;