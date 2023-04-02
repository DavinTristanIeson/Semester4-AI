import { useRef, useState } from "react";
import { PrimaryButton } from "../../components/Buttons";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

import "./login.css";

function App(){
    return <div className="container-fluid">
        <div className="row justify-content-center">
            <FormLayout/>
            <SlidingTextAnimation/>
        </div>
    </div>
}

interface SlidingTextProps {
    isFacingRight: boolean
}
function SlidingText({isFacingRight}:SlidingTextProps){
    return <div>
        <div className={`sliding-text ${isFacingRight ? 'face-right' : 'face-left'}`}>
        </div>
    </div>
}

function SlidingTextAnimation(){
    return <div className="col-5 mt-5 sliding-text-container d-none d-lg-block">
        <SlidingText isFacingRight={true}/>
        <SlidingText isFacingRight={false}/>
        <SlidingText isFacingRight={true}/>
        <SlidingText isFacingRight={false}/>
    </div>
}

function FormLayout(){
    const [isLogin, letLogin] = useState(true);
    function changeForm(){
        letLogin(login => !login);
    }
    return <div className="bg-white mt-5 m-3 pt-4 px-3
        position-relative very-rounded col-lg-6 col-8 notepad-shadow" style={{minHeight: "850px"}}>
        <div className="d-flex align-items-center justify-content-center mb-5">
            <div className="notepad-hole mx-2"></div>
            <div className="notepad-hole mx-2"></div>
            <div className="notepad-hole mx-2"></div>
        </div>
        {
            isLogin
            ?
            <>
                <h1 className="text-center">Welcome Back!</h1>
                <LoginForm/>
                <p className="position-absolute bottom-0">Don't have an account? <PrimaryButton onClick={changeForm}>Register</PrimaryButton> here!</p>
            </>
            :
            <>
                <h1 className="text-center">Welcome!</h1>
                <RegisterForm/>
                <p className="position-absolute bottom-0">Already have an account? <PrimaryButton onClick={changeForm}>Login</PrimaryButton> here!</p>
            </>
        }
    </div>
}

export default App;