import { extname } from "path";

export const nameFile=(file: string)=>
{
    return `${Date.now()}${extname(file)}`;
}