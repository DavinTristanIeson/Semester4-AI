import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArbitraryInput } from "../../components/Inputs";
import { FileInputObject, TextInputObject } from "../../helpers/inputs";
import { isNotEmpty, validateEmail, validateName, validatePassword } from "../../helpers/inputValidators";

interface RegisterFormInputLabels {
    "Email":string,
    "Password":string,
    "Name":string,
    "About You":string,
    "Profile Picture":File
}

function RegisterForm(){
    const inputs = useRef([
        new TextInputObject("Email", "", validateEmail),
        new TextInputObject("Password", "", validatePassword),
        new TextInputObject("Name", "", validateName),
        new TextInputObject("About You", "", (value)=>"", {isTextarea: true}),
        new FileInputObject("Profile Picture", (file)=>(file ? "" : "Profile picture is required"), {
            accept: "image/*"
        })
    ]);
    const [isValidating, letValidate] = useState(false);
    const navigate = useNavigate();
    
    function createFormData(responses:RegisterFormInputLabels){
        const formData = new FormData();
        formData.append("email", responses["Email"]);
        formData.append("password", responses["Password"]);
        formData.append("name", responses["Name"]);
        formData.append("bio", responses["About You"]);
        formData.append("pfp", responses["Profile Picture"]);
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
        navigate("/", {replace:true});
    }
    return <form action='/register' method='post' onSubmit={onSubmit}>
        {/* https://stackoverflow.com/questions/69510795/component-doesnt-update-on-props-change
        Solusi yang sangat hack-y, tapi yang penting errornya langsung ter-update setelah letValidate deh */}
        { inputs.current.map(x => <ArbitraryInput input={x} shouldValidate={isValidating} key={`${x.id}${isValidating}`}/>) }
        <div className="text-center">
            <input type="submit" className="btn btn-primary m-2 p-2 w-50 fw-bold"
                value="Register"/>
        </div>
    </form>
}

export default RegisterForm;