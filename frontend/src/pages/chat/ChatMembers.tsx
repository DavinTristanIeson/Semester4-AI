import { useContext, useState } from "react";
import { PrimaryButton } from "../../components/Buttons";
import { MaybeImage } from "../../components/Image";
import { UserAccount } from "../../helpers/classes"
import { ChatroomContext, CurrentUserContext } from "./context";

interface RequireUser {
    user: UserAccount
}

export function MemberInfo({user}:RequireUser){
    return <div className="member-info rounded bg-white py-2">
        <h5>Tentang Saya</h5>
        <p>{user.bio || <i>Pengguna tidak menulis bio</i>}</p>
    </div>
}

export function MemberListItem({user}:RequireUser){
    const [isShowingInfo, letShowInfo] = useState(false);
    const currentUser = useContext(CurrentUserContext);
    function openInfo(){
        letShowInfo(x => !x);
    }
    return <div className="member-list-item my-1" onClick={openInfo}>
        <div className={`d-flex align-items-center rounded ps-3 py-2 ${currentUser?.id == user.id ? 'bg-highlight-dark' : 'bg-highlight'}`}>
            <MemberIcon user={user}/>
            <div className="ms-3">
                <h5 className="my-0">{user.username}</h5>
                <p className="fw-light my-0">{user.email}</p>
            </div>
        </div>
        {isShowingInfo && <MemberInfo user={user}/>}
    </div>
}

export function MemberIcon({user}:RequireUser){
    return <MaybeImage className="icon-circle" src={user.pfp} alt={user.username}/>
}

function ChatMembers(){
    const chatroom = useContext(ChatroomContext);
    function editChatSettings(){
        // TODO: chat settings
    }
    return <div className="col-3 chat-member-list bg-white px-4 pt-4 pb-2">
        <div className="overflow-y-scroll h-screen">
            { chatroom!.members.map(x => <MemberListItem key={x.id} user={x}/>) }
        </div>
        <PrimaryButton onClick={editChatSettings}>
            Pengaturan Chatroom
        </PrimaryButton>
    </div>
}

export default ChatMembers;