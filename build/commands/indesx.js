import { extractMessage, setupMessagingServices } from "../exports/messages.js";
import { ping } from "./users/ping.js";
import { menu } from "./users/menu.js";
import { spam } from "./users/spam/index.js";
import { createImageSticker } from "./users/sticker.js";
export async function handleCommand(faputa, from, m) {
    const { fullMessage, commandName, fromUser, media, isCommand, messageContent, textMessage, from: messageFrom, userName, groupId, } = extractMessage(m);
    // Ignora mensagens do próprio bot
    if (messageFrom === faputa.user.id)
        return;
    // Usa o JID correto (remoteJid)
    const jid = m.key.remoteJid;
    // Setup dos serviços de envio sem marcar usuários
    const enviarTexto = async (msg) => {
        await faputa.sendMessage(jid, { text: msg });
    };
    const enviarAudioGravacao = async (audio) => {
        await faputa.sendMessage(jid, { audio, mimetype: "audio/mpeg" });
    };
    const enviarImagem = async (image, caption) => {
        await faputa.sendMessage(jid, { image, caption: caption || "" });
    };
    const enviarVideo = async (video, caption) => {
        await faputa.sendMessage(jid, { video, caption: caption || "" });
    };
    const enviarDocumento = async (doc, filename) => {
        await faputa.sendMessage(jid, { document: doc, fileName: filename || "arquivo" });
    };
    // Apenas loga mensagens que não são comandos
    if (!isCommand) {
        console.log(`-> ${userName || fromUser || "Desconhecido"}: ${textMessage}`);
        return;
    }
    console.log(`» ${userName} ҂ ${commandName}`);
    // Lista de comandos
    const commands = {
        ping,
        spam,
        menu,
        sticker: createImageSticker,
        s: createImageSticker,
        stiker: createImageSticker,
        m: menu,
    };
    const command = commands[commandName];
    if (command) {
        await command(faputa, jid, m, {
            enviarTexto,
            enviarImagem,
            enviarAudioGravacao,
            enviarVideo,
            enviarDocumento,
        });
    }
    else {
        await enviarTexto(`❌ Comando *${commandName}* não encontrado. Digite Menu.`);
    }
}
