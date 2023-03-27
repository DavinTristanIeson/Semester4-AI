import { useReducer, useRef, useState } from "react";
import { PrimaryButton } from "../../components/Buttons";
import { ArbitraryInput, TextInput } from "../../components/Inputs";
import { TextInputObject } from "../../helpers/inputs";
import { isNotEmpty, validateEmail } from "../../helpers/inputValidators";

function LoginForm(){
    const inputs = useRef([
        new TextInputObject("Username/Email", "", isNotEmpty("Email harus diisi")),
        new TextInputObject("Password", "", isNotEmpty("Password harus diisi")),
    ]);
    
    const [isValidating, letValidate] = useState(false);
    function onSubmit(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        let hasError:boolean = false;
        for (let input of inputs.current){
            if (input.validate()){
                hasError = true; break;
            }
        }
        letValidate(true);
        
        // TODO: send request to backend
    }
    return <form action='/login' method='post' onSubmit={onSubmit}>
        {/* https://stackoverflow.com/questions/69510795/component-doesnt-update-on-props-change
        Solusi yang sangat hack-y, tapi yang penting errornya langsung ter-update setelah letValidate deh */}
        { inputs.current.map(x => <ArbitraryInput input={x} shouldValidate={isValidating} key={`${x.id}${isValidating}`}/>) }
        <div className="text-center">
            <input type="submit" className="btn btn-primary m-2 p-2 w-50 fw-bold"
                value="Login"/>
        </div>
    </form>
}

export default LoginForm;