import { useState } from "react";
import { FileInputObject, InputObject, TextInputObject, TypeGuards } from "../helpers/inputs";

interface InputProps<IO extends InputObject> {
    input:IO,
    className?:string,
    shouldValidate?:boolean,
}

export function useValidateInput<T, ET>(input:InputObject<T>, parser:(raw:React.ChangeEvent<ET>) => T, shouldValidate?:boolean){
    const [error, setError] = useState(shouldValidate ? input.validate() : "");
    const [value, setValue] = useState(input.value);
    function onInput(e: React.ChangeEvent<ET>){
        input.value = parser(e);
        setValue(input.value);
        if (shouldValidate){
            setError(input.validate());
        }
    }
    return {error, value, onInput};
}
export function TextInput({input, className, shouldValidate}:InputProps<TextInputObject>){
    const {error, value, onInput} = useValidateInput<string, HTMLInputElement>(input, raw => raw.target.value, shouldValidate);
    return <div className="m-3">
        <label className="fw-medium" htmlFor={input.id}>{input.label}</label>
        <input
            type={input.options.semanticType || 'text'}
            placeholder={input.label}
            className={className ?? ''}
            onChange={onInput}
            value={value}
            id={input.id}
        />
        {error.length > 0 && <p className="fw-medium text-danger">{ error }</p>}
    </div>
}

export function TextareaInput({input, className, shouldValidate}:InputProps<TextInputObject>){
    const {error, value, onInput} = useValidateInput<string, HTMLTextAreaElement>(input, raw => raw.target.value, shouldValidate);
    return <div className="m-3">
        <label className="fw-medium" htmlFor={input.id}>{input.label}</label>
        <textarea
            placeholder={input.label}
            className={className ?? ''}
            onChange={onInput}
            value={value}
            id={input.id}
        ></textarea>
        {error.length > 0 && <p className="fw-medium text-danger">{ error }</p>}
    </div>
}

export function FileInput({input, className, shouldValidate}:InputProps<FileInputObject>){
    const {error, value, onInput} = useValidateInput<File|undefined, HTMLInputElement>(input, raw => raw.target.files?.[0], shouldValidate);
    return <div className="m-3">
        <label className="fw-medium input-file">
            <input
                type="file"
                placeholder={input.label}
                className={className ?? ''}
                onChange={onInput}
                accept={input.options.accept}
            />
            {value ? value.name : input.label}
        </label>
        {error.length > 0 && <p className="fw-medium text-danger">{ error }</p>}
    </div>
}

export function ArbitraryInput({input, className, shouldValidate}:InputProps<InputObject>){
    if (TypeGuards.isText(input)){
        if (input.options.isTextarea) return <TextareaInput input={input} className={className} shouldValidate={shouldValidate}/>
        else return <TextInput input={input} className={className} shouldValidate={shouldValidate}/>
    } else if (TypeGuards.isFile(input)){
        return <FileInput input={input} className={className} shouldValidate={shouldValidate}/>
    } else {
        return <h2 className="text-danger">{input.type} is not implemented!</h2>
    }
}