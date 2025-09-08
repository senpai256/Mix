import dotenv from "dotenv";
import fs from "fs";
dotenv.config();
const PREFIX = process.env.PREFIX || "!";
/**
 * Extrai informações úteis de uma mensagem recebida
 */
export const extractMessage = (m) => {
    if (!m || !m.message) {
        console.error("Detalhes da mensagem não encontrados ou estão mal formatados");
        return {
            media: undefined,
            mentions: [],
            fullMessage: "",
            from: "Desconhecido",
            fromUser: "Desconhecido",
            isCommand: false,
            commandName: "",
            args: [],
            userName: "Desconhecido",
            userRole: "membro",
            participant: null,
        };
    }
    // Possíveis origens do texto
    const message = m.message[0];
    const textMessage = m.message?.conversation || "";
    const extendedTextMessage = m.message?.extendedTextMessage?.text || "";
    const imageTextMessage = m.message?.imageMessage?.caption || "";
    const videoTextMessage = m.message?.videoMessage?.caption || "";
    const quotedMessage = m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation || "";
    // Escolhe a prioridade do texto
    const fullMessage = textMessage || extendedTextMessage || imageTextMessage || videoTextMessage || quotedMessage;
    // Menções
    const mentions = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    // Identificação do usuário
    const fromUser = m.key?.participant?.split("@")[0] || m.key?.remoteJid?.split("@")[0];
    const userName = m.pushName || fromUser || "Usuário";
    // Grupo ou PV
    const groupId = m.key?.remoteJid || null;
    // Identificador de origem
    const from = m.key?.remoteJid || "Remetente desconhecido";
    // Número do participante (remove :xx que aparece em grupos)
    const phoneNumber = m?.key?.participant?.replace(/:[0-9][0-9]?/g, "") || fromUser;
    // Se é comando
    const isCommand = fullMessage.startsWith(PREFIX);
    const commandName = isCommand ? fullMessage.slice(PREFIX.length).split(" ")[0] : "";
    const args = isCommand ? fullMessage.slice(PREFIX.length).split(" ").slice(1) : [];
    // Mensagens citadas
    const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage ||
        m.message?.imageMessage?.contextInfo?.quotedMessage ||
        m.message?.videoMessage?.contextInfo?.quotedMessage ||
        m.message?.audioMessage?.contextInfo?.quotedMessage ||
        m.message?.documentMessage?.contextInfo?.quotedMessage;
    // Conteúdo textual simples
    const messageContent = m.message?.extendedTextMessage?.text || m.message?.text || "";
    // Mídia (direta ou marcada)
    const media = m.message?.imageMessage ||
        m.message?.videoMessage ||
        m.message?.audioMessage ||
        m.message?.stickerMessage ||
        m.message?.documentMessage ||
        quoted?.imageMessage ||
        quoted?.videoMessage ||
        quoted?.audioMessage ||
        quoted?.stickerMessage ||
        quoted?.documentMessage ||
        undefined;
    return {
        messageContent,
        key: m.key || null,
        quoted,
        quotedKey: quoted || null,
        media,
        mentions,
        fullMessage,
        from,
        phoneNumber,
        fromUser,
        isCommand,
        commandName,
        args,
        textMessage,
        userName,
        groupId,
        participant: m.key?.participant || m.key?.remoteJid,
        message
    };
};
/**
 * Serviços de envio de mensagens
 */
export function setupMessagingServices(faputa, from, m) {
    const enviarTexto = async (texto) => {
        try {
            await faputa.sendMessage(from, { text: texto }, { quoted: m });
        }
        catch (error) {
            console.error("Erro ao enviar texto:", error);
        }
    };
    const enviarAudioGravacao = async (arquivo) => {
        try {
            await faputa.sendMessage(from, {
                audio: fs.readFileSync(arquivo),
                mimetype: "audio/mp4",
                ptt: true,
            }, { quoted: m });
        }
        catch (error) {
            console.error("Erro ao enviar áudio:", error);
        }
    };
    const enviarImagem = async (arquivo, text) => {
        try {
            if (typeof arquivo === "string" && arquivo.startsWith("http")) {
                await faputa.sendMessage(from, { image: { url: arquivo }, caption: text }, { quoted: m });
            }
            else if (Buffer.isBuffer(arquivo)) {
                await faputa.sendMessage(from, { image: arquivo, caption: text }, { quoted: m });
            }
            else if (typeof arquivo === "string" && fs.existsSync(arquivo)) {
                const imageBuffer = fs.readFileSync(arquivo);
                await faputa.sendMessage(from, { image: imageBuffer, caption: text }, { quoted: m });
            }
            else {
                console.error("Arquivo de imagem inválido:", arquivo);
            }
        }
        catch (error) {
            console.error("Erro ao enviar imagem:", error);
        }
    };
    const enviarVideo = async (arquivo, text) => {
        try {
            await faputa.sendMessage(from, {
                video: fs.readFileSync(arquivo),
                caption: text,
                mimetype: "video/mp4",
            }, { quoted: m });
        }
        catch (error) {
            console.error("Erro ao enviar vídeo:", error);
        }
    };
    const enviarDocumento = async (arquivo, text) => {
        try {
            await faputa.sendMessage(from, { document: fs.readFileSync(arquivo), caption: text }, { quoted: m });
        }
        catch (error) {
            console.error("Erro ao enviar documento:", error);
        }
    };
    const enviarSticker = async (arquivo) => {
        try {
            await faputa.sendMessage(from, { sticker: fs.readFileSync(arquivo) }, { quoted: m });
        }
        catch (error) {
            console.error("Erro ao enviar sticker:", error);
        }
    };
    const enviarLocalizacao = async (latitude, longitude, text) => {
        try {
            await faputa.sendMessage(from, { location: { latitude, longitude, caption: text } }, { quoted: m });
        }
        catch (error) {
            console.error("Erro ao enviar localização:", error);
        }
    };
    const enviarContato = async (numero, nome) => {
        try {
            await faputa.sendMessage(from, { contact: { phone: numero, name: { formattedName: nome } } }, { quoted: m });
        }
        catch (error) {
            console.error("Erro ao enviar contato:", error);
        }
    };
    return {
        enviarTexto,
        enviarAudioGravacao,
        enviarImagem,
        enviarVideo,
        enviarDocumento,
        enviarSticker,
        enviarLocalizacao,
        enviarContato,
    };
}
