import { useState } from "react";

interface MaybeImageProps {
    src:string,
    alt:string,
    className?:string,
    defaultImage?:string,
    onClick?:()=>void,
}

export let DEFAULT_IMAGE_SOURCE = "/image-not-available.jpg"
export function MaybeImage({src, alt, defaultImage, className, onClick}: MaybeImageProps){
    const [imgSrc, setImgSrc] = useState(src);
    function imageNotAvailable(){
        setImgSrc(defaultImage || DEFAULT_IMAGE_SOURCE);
    }
    return <img className={className} src={imgSrc} alt={alt} onError={imageNotAvailable} onClick={onClick}/>
}