import { Outlet } from "react-router-dom";
import { ErrorAlert, Spinner } from "./components/Informative";
import { useEffect, useRef, useState } from "react";
import { CurrentUserContext, PageStateContext } from "./context";
import { UserAccount } from "./helpers/classes";
import { API, SERVER_ERROR } from "./helpers/constants";

function Layout(){
    const [isLoading, letLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const timeoutID = useRef(-1);
    const messageHandler = (message:string, timeout:number|null) => {
        setErrMsg(message);
        if (timeout === null) return;
        clearInterval(timeoutID.current);
        timeoutID.current = setTimeout(() => {
            setErrMsg("");
        }, timeout);
    }
    function cleanup(){
        letLoading(false);
        clearInterval(timeoutID.current);
        setErrMsg("");
    }

    let [user, setUser] = useState<UserAccount|null>(null);
    useEffect(()=>{
        fetch(API + "/accounts/", {credentials: "include"})
            .then(res => {
                if (res.ok){
                    res.json()
                        .then(json => setUser(UserAccount.fromJSON(json)))
                }
            })
    }, []);
    return <>
    <PageStateContext.Provider value={{isLoading, errMsg, letLoading, setErrMsg: messageHandler, cleanup}}>
        <CurrentUserContext.Provider value={{user, setUser}}>
        {isLoading && <Spinner/>}
        {errMsg.length > 0 && <ErrorAlert message={errMsg} isFloating={true}/>}
        <Outlet/>
        </CurrentUserContext.Provider>
    </PageStateContext.Provider>
    </>
}

export default Layout;