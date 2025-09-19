import dotenv from "dotenv"
import { extractMessage, setupMessagingServices } from "../../exports/messages.js"
dotenv.config()

const PREFIX = process.env.PREFIX || "!"
const BOT_NAME = process.env.BOT_NAME || ""

export function menuCaption(m: any){
    const {userName} = extractMessage(m)

    console.log(userName)

    return 
     return `╭─═════༻-༺════─╮
[ ✧ ]  Me: ${BOT_NAME}
[ ✧ ]  Prefix: (${PREFIX})
[ ✧ ]  Status: Online
[ ✧ ]  Usuário: ${userName}
         
[ ✧ ]  Comandos: s, f, sticker
[ ✧ ]  Comandos: toimg
[ ✧ ]  Comandos: ping
[ ✧ ]  Comandos: menu
[ ✧ ]  Comandos: del
[ ✧ ]  Comandos: help
╰─═════༻-༺════─╯`;
}


