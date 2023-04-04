import { Await, useLocation, useNavigate } from "react-router-dom";
import { API, CONNECTION_ERROR } from "./constants";
import { ReactNode, useContext, useEffect, useState } from "react";
import { PageStateContext } from "../context";
import { Suspense } from "react";

interface ProtectedRouteProps {
    children: ReactNode
};
export function ProtectedRoute({children}:ProtectedRouteProps){
    const route = useLocation();
    const navigate = useNavigate();
    const pageState = useContext(PageStateContext);
    const [hasLoaded, letLoaded] = useState(false);
    let promise = new Promise(()=>{});
    useEffect(() => {
        pageState?.letLoading(true);
        promise = fetch(API + "/accounts/me", {credentials: "include"})
            .then((res) => {
                pageState?.letLoading(false);
                if (res.ok && route.pathname.startsWith("/login")){
                    navigate("/", {replace: true});
                } else if (!res.ok && !route.pathname.startsWith("/login")){
                    navigate("/login", {replace: true});
                }
                letLoaded(true);
            })
            .catch((err) => {
                console.error(err);
                pageState?.setErrMsg(CONNECTION_ERROR, 3000);
                pageState?.letLoading(false);
            });
    }, []);
    return <>
        {hasLoaded && children}
    </>
}