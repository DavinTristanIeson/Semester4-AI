export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
export const NAME_REGEX = /^[a-zA-Z0-9]+$/
export const PHONE_REGEX = /^[0-9]{10,12}$/

export function validateEmail(email:string){
    if (email.length == 0) return "Email harus diisi";
    else if (!email.match(EMAIL_REGEX)) return "Format email tidak sesuai";
}
export function validatePassword(password:string){
    return password.length < 8 ? "Password harus terdiri dari minimal 8 karakter" : "";
}
export function validateName(name:string){
    if (name.length < 5) return "Nama harus terdiri dari minimal 5 karakter";
    else if (!name.match(NAME_REGEX)) return "Nama hanya boleh terdiri dari huruf alfabet dan angka 0-9 saja";
}
export function validatePhoneNumber(phone:string){
    if (phone.length == 0) return "No. telp harus diisi";
    else if (!phone.match(PHONE_REGEX))  return "No. telp harus terdiri dari 10-12 angka";
}
export function isNotEmpty(errorMessage:string){
    return (value:string) => value.length > 0 ? "" : errorMessage;
}