import { Outlet } from "react-router-dom";
import { ErrorAlert, Spinner } from "./components/Informative";
import { useRef, useState } from "react";
import { PageStateContext } from "./context";

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
    return <>
    <PageStateContext.Provider value={{isLoading, errMsg, letLoading, setErrMsg: messageHandler, cleanup}}>
        {isLoading && <Spinner/>}
        {errMsg.length > 0 && <ErrorAlert message={errMsg} isFloating={true}/>}
        <Outlet/>
    </PageStateContext.Provider>
    </>
}

export default Layout;