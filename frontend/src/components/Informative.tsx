
export function Spinner(){
    return <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
    </div>
}

interface AlertProps {
    message: string
    isFloating?: boolean,
    onClose?: () => void
}
export function ErrorAlert({message, isFloating, onClose}: AlertProps){
    return <div className={"alert alert-danger" + (isFloating ? " floating-alert" : "")}
        role="alert"
        onClick={onClose}
    >
        { message }
    </div>
}