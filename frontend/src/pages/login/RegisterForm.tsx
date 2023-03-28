import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArbitraryInput } from "../../components/Inputs";
import { FileInputObject, TextInputObject } from "../../helpers/inputs";
import { isNotEmpty, validateEmail, validateName, validatePassword } from "../../helpers/inputValidators";

interface RegisterFormInputLabels {
    "Email":string,
    "Password":string,
    "Username":string,
    "Tentang Anda":string,
    "Foto Profil":File
}

function RegisterForm(){
    const inputs = useRef([
        new TextInputObject("Email", "", validateEmail),
        new TextInputObject("Password", "", validatePassword),
        new TextInputObject("Username", "", validateName),
        new TextInputObject("Tentang Anda", "", (value)=>"", {isTextarea: true}),
        new FileInputObject("Foto Profil", (file)=>(file ? "" : "Foto profil anda diperlukan"), {
            accept: "image/*"
        })
    ]);
    const [isValidating, letValidate] = useState(false);
    const navigate = useNavigate();
    
    function createFormData(responses:RegisterFormInputLabels){
        const formData = new FormData();
        formData.append("email", responses["Email"]);
        formData.append("password", responses["Password"]);
        formData.append("username", responses["Username"]);
        formData.append("bio", responses["Tentang Anda"]);
        formData.append("pfp", responses["Foto Profil"]);
        return formData;
    }

    function onSubmit(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        let hasError:boolean = false;
        const responses:{[key:string]:string|File|undefined} = {}
        for (let input of inputs.current){
            responses[input.label] = input.value;
            if (input.validate()){
                hasError = true; break;
            }
        }
        letValidate(true);
        if (hasError) return;

        const formData = createFormData(responses as unknown as RegisterFormInputLabels);
        console.log(Array.from(formData.values()));

        // TODO: send request to backend
        navigate("/");
    }
    return <form action='/register' method='post' onSubmit={onSubmit}>
        {/* https://stackoverflow.com/questions/69510795/component-doesnt-update-on-props-change
        Solusi yang sangat hack-y, tapi yang penting errornya langsung ter-update setelah letValidate deh */}
        { inputs.current.map(x => <ArbitraryInput input={x} shouldValidate={isValidating} key={`${x.id}${isValidating}`}/>) }
        <div className="text-center">
            <input type="submit" className="btn btn-primary m-2 p-2 w-50 fw-bold"
                value="Daftar"/>
        </div>
    </form>
}

export default RegisterForm;