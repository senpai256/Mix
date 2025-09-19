import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const PREFIX = process.env.PREFIX || "!";

/**
 * Extrai informações úteis de uma mensagem recebida
 */
export const extractMessage = (m: any) => {
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
  const quotedMessage =
    m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation || "";

  // Escolhe a prioridade do texto
  const fullMessage =
    textMessage || extendedTextMessage || imageTextMessage || videoTextMessage || quotedMessage;

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
  const quoted =
    m.message?.extendedTextMessage?.contextInfo?.quotedMessage ||
    m.message?.imageMessage?.contextInfo?.quotedMessage ||
    m.message?.videoMessage?.contextInfo?.quotedMessage ||
    m.message?.audioMessage?.contextInfo?.quotedMessage ||
    m.message?.documentMessage?.contextInfo?.quotedMessage;

  // Conteúdo textual simples
  const messageContent = m.message?.extendedTextMessage?.text || m.message?.text || "";

  // Mídia (direta ou marcada)
  const media =
    m.message?.imageMessage ||
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
// src/exports/messages.ts

export function setupMessagingServices(faputa: any, from: string, m: any) {
  // === Funções que permitem passar o destino (spam) ===
  const enviarTextospam = async (texto: string, jid = from) => {
    try {
      await faputa.sendMessage(jid, { text: texto }, );
    } catch (error) {
      console.error("Erro ao enviar mensagem (spam):", error);
    }
  };

  const enviarImagemspam = async (path: string, jid = from) => {
    try {
      await faputa.sendMessage(jid, { image: { url: path } }, );
    } catch (error) {
      console.error("Erro ao enviar imagem (spam):", error);
    }
  };

  // === Funções normais (sempre respondem ao from) ===
  const enviarTexto = async (texto: string) => {
    try {
      await faputa.sendMessage(from, { text: texto }, { quoted: m });
    } catch (error) {
      console.error("Erro ao enviar texto:", error);
    }
  };

 const enviarImagem = async (arquivo: string | Buffer, text?: string) => { try { if (typeof arquivo === "string" && arquivo.startsWith("http")) { await faputa.sendMessage(from, { image: { url: arquivo }, caption: text }, { quoted: m }); } else if (Buffer.isBuffer(arquivo)) { await faputa.sendMessage(from, { image: arquivo, caption: text }, { quoted: m }); } else if (typeof arquivo === "string" && fs.existsSync(arquivo)) { const imageBuffer = fs.readFileSync(arquivo); await faputa.sendMessage(from, { image: imageBuffer, caption: text }, { quoted: m }); } else { console.error("Arquivo de imagem inválido:", arquivo); } } catch (error) { console.error("Erro ao enviar imagem:", error); } };
 // Função para enviar áudio de gravação (PTT)
  const enviarAudioGravacao = async (path: string) => {
    try {
      await faputa.sendMessage(
        from,
        { audio: { url: path }, mimetype: "audio/mp4", ptt: true },
        { quoted: m }
      );
    } catch (error) {
      console.error("Erro ao enviar áudio:", error);
    }
  };

  const enviarVideo = async (path: string) => {
    try {
      await faputa.sendMessage(from, { video: { url: path } }, { quoted: m });
    } catch (error) {
      console.error("Erro ao enviar vídeo:", error);
    }
  };

  const enviarDocumento = async (path: string, mimetype: string, fileName: string) => {
    try {
      await faputa.sendMessage(
        from,
        { document: { url: path }, mimetype, fileName },
        { quoted: m }
      );
    } catch (error) {
      console.error("Erro ao enviar documento:", error);
    }
  };

  const enviarSticker = async (path: string) => {
    try {
      await faputa.sendMessage(from, { sticker: { url: path } }, { quoted: m });
    } catch (error) {
      console.error("Erro ao enviar figurinha:", error);
    }
  };

  const enviarLocalizacao = async (latitude: number, longitude: number, name?: string) => {
    try {
      await faputa.sendMessage(
        from,
        { location: { degreesLatitude: latitude, degreesLongitude: longitude, name } },
        { quoted: m }
      );
    } catch (error) {
      console.error("Erro ao enviar localização:", error);
    }
  };

  const enviarContato = async (numero: string, nome: string) => {
    try {
      await faputa.sendMessage(
        from,
        {
          contacts: {
            displayName: nome,
            contacts: [{ displayName: nome, vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${nome}\nTEL;type=CELL;type=VOICE;waid=${numero}:${numero}\nEND:VCARD` }],
          },
        },
        { quoted: m }
      );
    } catch (error) {
      console.error("Erro ao enviar contato:", error);
    }
  };

  // === Retorno com todas as funções disponíveis ===
  return {
    // Funções normais
    enviarTexto,
    enviarImagem,
    enviarAudioGravacao,
    enviarVideo,
    enviarDocumento,
    enviarSticker,
    enviarLocalizacao,
    enviarContato,

    // Funções que aceitam jid (spam)
    enviarTextospam,
    enviarImagemspam,
  };
}


