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
        new TextInputObject("Judul Chatroom", chatroom.settings.title, validateChatroomTitle),
        new TextInputObject("Deskripsi Chatroom", chatroom.settings.description, noValidate, {
            isTextarea: true,
        }),
        new FileInputObject("Thumbnail Chatroom", noValidate, {
            accept: "image/*"
        }),
        new CheckboxInputObject("Pengaturan", chatroomOptions, [
            {label: "Hapus Pesan Toksik", value:"filtered"},
            {label: "Chatroom Publik", value:"public"}
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
        if (!confirm("Apakah anda yakin anda mau menghapus chatroom ini?")) return;
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
                Simpan
            </PrimaryButton>
            <DangerButton onClick={deleteChatroom} className="w-25">
                Delete Chatroom Ini
            </DangerButton>
            <button className="btn btn-secondary m-2 p-2 w-25"
            onClick={onClose}>
                Batal
            </button>
        </div>
    </div>
}

export default ChatOptions;