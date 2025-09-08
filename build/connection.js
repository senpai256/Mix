import makeWASocket, { DisconnectReason, useMultiFileAuthState } from "baileys";
import pino from "pino";
import path from "path";
import { logger } from "./exports/confs.js";
import { question } from "./exports/confs.js";
import { Boom } from "@hapi/boom";
import { __dirname } from "./exports/confs.js";
import { __filename } from "./exports/confs.js";
import { handleCommand } from "./commands/indesx.js";
import { extractMessage } from "./exports/messages.js";
export async function reng() {
    const { state, saveCreds } = await useMultiFileAuthState(path.resolve(__dirname, "../../db/qr-code"));
    const faputa = makeWASocket({
        printQRInTerminal: false,
        auth: state,
        browser: ["Ubuntu", "Chrome", "100.0.4896.127"],
        markOnlineOnConnect: true,
        logger,
        syncFullHistory: true,
    });
    //Emaparelhamento se nao registrado
    if (!state.creds?.registered) {
        let phoneNumber = await question("Digite o numero com o codigo do pais (exemplo: 5511999999999): ");
        phoneNumber = phoneNumber.replace(/[^0-9]/g, "");
        if (!phoneNumber) {
            throw new Error("Numero invalido");
        }
        const code = await faputa.requestPairingCode(phoneNumber);
        console.log(`codigo enviado para ${phoneNumber}: ${code}`);
    }
    faputa.ev.on("creds.update", saveCreds);
    faputa.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            const sholdReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log("conexao fechada devido ao error ", lastDisconnect?.error, ", reconnecting ", sholdReconnect);
            if (sholdReconnect) {
                reng();
            }
        }
        else if (connection === "open") {
            console.log("conexao aberta");
        }
    });
    faputa.ev.on("messages.upsert", async (m) => {
        try {
            const msg = m.messages[0];
            if (!msg || !msg.message)
                return;
            const { isCommand, fullMessage, fromUser, userName, textMessage } = extractMessage(msg);
            if (msg.key.fromMe)
                return; // ignora mensagens do próprio bot
            console.log(`Mensagem recebida de ${userName}: ${fullMessage}`);
            //
            const lower = textMessage.toLowerCase();
            if (lower.includes("oi") || lower.includes("ola")) {
                console.log("responder ola");
                await faputa.sendMessage(msg.key.remoteJid, { text: `Ola ${userName || fromUser}, tudo bem?` }, { quoted: msg });
            }
            //
            if (isCommand) {
                await handleCommand(faputa, fromUser, msg);
            }
        }
        catch (error) {
            console.log("erro ao extrair mensagem: ", error);
        }
    });
}
