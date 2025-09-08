import dotenv from "dotenv"
import { extractMessage, setupMessagingServices } from "../../exports/messages.js"
dotenv.config()

const PREFIX = process.env.PREFIX || "!"
const BOT_NAME = process.env.BOT_NAME || ""

export function menuCaption(m: any){
    const {userName} = extractMessage(m)

    console.log(userName)

    return `
    Me:${BOT_NAME}
    Prefixo: ${PREFIX}
    Olá, ${userName || "usuário"}! Bem-vindo ao menu principal. Escolha uma das opções abaixo:
    Ping - Verifica a conectividade com o bot.`

}


