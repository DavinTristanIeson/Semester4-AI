import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useInformativeFetch } from "./helpers/fetch";
import { API } from "./helpers/constants";

function Invite(){
    const { link } = useParams();
    const infoFetch = useInformativeFetch();
    const navigate = useNavigate();
    useEffect(()=>{
        infoFetch(() => fetch(API + "/chatroom/invite/" + link, {
            credentials: "include",
            method: "POST",
        }))
        .then(res => res.json())
        .then(json => navigate("/chat/" + json.id))
        .catch(() => {});
    }, []);
    return <></>
}

export default Invite;