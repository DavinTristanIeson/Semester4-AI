interface PrimaryButtonProps {
    onClick: (e:React.MouseEvent<HTMLButtonElement>)=>void;
    children: React.ReactNode,
}

export function PrimaryButton({onClick, children}: PrimaryButtonProps){
    return <>
        <button className="btn btn-primary m-2 p-2 fw-bold" onClick={onClick}>
            { children }
        </button>
    </>
}