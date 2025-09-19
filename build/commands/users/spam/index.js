import dotenv from "dotenv";
import { setupMessagingServices } from "../../../exports/messages.js";
dotenv.config();
function pickRandom(arr) {
    return arr.length > 0
        ? arr[Math.floor(Math.random() * arr.length)] ?? ""
        : "";
}
export async function spam(faputa) {
    const message = process.env.MENSSAGE ||
        "📢 Semana do Cliente IM 🎉\nVocê faz parte da nossa lista VIP e foi contemplado com uma condição exclusiva:\n 👉 Crédito estudantil facilitado, sem consulta ao SPC 🚀\nEssa é a sua chance de garantir sua matrícula no curso dos seus sonhos, sem burocracia e com condições especiais que só valem na Semana do Cliente.\n⚠ Vagas limitadas e prazo curto!\n 💬 Responda ’’EU QUERO’’ agora e garanta seu benefício.";
    const numbers = (process.env.CONTACTS?.split(",") ?? []);
    const emojis = (process.env.EMOJIS?.split(",") ?? ["✨", "🎉", "🚀", "👍"]);
    let count = 0;
    for (const number of numbers) {
        const jid = `${number.trim()}@s.whatsapp.net`;
        // Setup das funções de envio sem marcar usuários
        const { enviarTextospam, enviarImagemspam } = setupMessagingServices(faputa, jid, null);
        const randomEmojis = Array.from({ length: 3 }, () => pickRandom(emojis)).join(" ");
        try {
            // Envia mensagem de texto sem marcar usuário
            await enviarTextospam(`${message} ${randomEmojis}`, jid);
            // Envia imagem sem marcar usuário
            //await enviarImagemspam("db/assets/img/mix.jpg", jid);
            console.log(`✅ Mensagem enviada para ${jid}`);
        }
        catch (error) {
            console.error(`❌ Erro ao enviar mensagem para ${jid}`, error);
        }
        count++;
        if (count % 4 === 0) {
            console.log("⏳ Aguardando 60 segundos para evitar bloqueio...");
            await new Promise((res) => setTimeout(res, 60_000));
        }
    }
}
