import { extractMessage, setupMessagingServices } from "../exports/messages.js";
import { ping } from "./users/ping.js";


export async function handleCommand(faputa: any, from: string, m: any) {
  const {
    fullMessage,
    commandName,
    fromUser,
    media,
    isCommand,
    messageContent,
    textMessage,
    from: messageFrom,
    userName,
    groupId,
  } = extractMessage(m);

  // Usa o JID correto (remoteJid)
  const jid = m.key.remoteJid;

  const { enviarTexto, enviarAudioGravacao, enviarImagem, enviarVideo, enviarDocumento } =
    setupMessagingServices(faputa, jid, m);

  if (messageFrom === faputa.user.id) return;

  if (!isCommand) {
    console.log(`=> Mensagem recebida de ${userName || fromUser || "Desconhecido"}: ${textMessage}`);
    return;
  }

  console.log(` » ${userName}҂${commandName}`);

  const commands: Record<string, Function> = { ping };

  const command = commands[commandName];
  if (command) {
    await command(faputa, jid, m, { enviarTexto, enviarImagem, enviarAudioGravacao, enviarVideo, enviarDocumento });
  } else {
    await enviarTexto(`❌ Comando *${commandName}* não reconhecido.`);
  }
}
