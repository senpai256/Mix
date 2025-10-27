import dotenv from "dotenv";
import { setupMessagingServices } from "../../../exports/messages.js";

dotenv.config();

// Função segura para pegar um item aleatório
function pickRandom<T>(arr: T[], fallback: T): T {
  if (arr.length === 0) return fallback;
  const item = arr[Math.floor(Math.random() * arr.length)];
  return item !== undefined ? item : fallback;
}

// Função para embaralhar a ordem de elementos
function shuffle<T>(array: T[]): T[] {
  return array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

// Gera pequenas variações da sua mensagem base
function gerarVariacao(emojis: string[]): string {
  const saudacoes = [
    "Olá 👋",
    "Oi 😄",
    "E aí! 👋",
    "Tudo bem? 🙌",
    "Hey! 👋",
  ];

  const introducoes = [
    "Você chegou a pedir informações sobre os cursos do Instituto Mix de Profissões, e por pouco não garantiu sua vaga.",
    "Lembra dos cursos do Instituto Mix? Você demonstrou interesse, mas acabou não finalizando a matrícula.",
    "Você já tinha solicitado informações sobre os cursos do Instituto Mix e quase garantiu sua vaga!",
    "Há um tempo você buscou informações sobre os cursos do Instituto Mix, mas não conseguiu concluir a inscrição.",
  ];

  const novidades = [
    "A boa notícia é que esta semana abrimos novas condições especiais pra quem ainda não conseguiu iniciar.",
    "Tem novidade boa: estamos com condições especiais para quem ainda não começou.",
    "Boas notícias! Reabrimos vagas com condições exclusivas para quem ainda não iniciou.",
    "E adivinha? Essa semana liberamos novas oportunidades com condições incríveis pra você começar.",
  ];

  const incentivo = [
    "É a sua chance de retomar de onde parou e começar com mais facilidade. 💥",
    "Essa é literalmente a chance de voltar de onde parou — agora com muito mais facilidade pra iniciar! 💪",
    "Uma oportunidade perfeita pra recomeçar de onde parou, com condições bem mais acessíveis. 🚀",
    "É o momento ideal pra retomar o que você queria começar! 💥",
  ];

  const chamada = [
    "Responda “EU QUERO” e garanta sua vaga.",
    "Basta responder “EU QUERO” pra garantir a sua vaga agora mesmo!",
    "Responde “EU QUERO” e comece ainda hoje! 🎯",
    "Manda um “EU QUERO” e já reserva sua vaga exclusiva. ✨",
  ];

  // Cria uma mistura de 2–3 emojis extras no final
  const emojiMix = Array.from(
    { length: 2 + Math.floor(Math.random() * 2) },
    () => pickRandom(emojis, "✨")
  ).join(" ");

  // Embaralha e junta as partes da mensagem
  const partes = shuffle([
    pickRandom(saudacoes, "Olá 👋"),
    pickRandom(introducoes, ""),
    pickRandom(novidades, ""),
    pickRandom(incentivo, ""),
    pickRandom(chamada, ""),
  ]);

  const mensagem = partes.join(" ").replace(/\s+/g, " ").trim();
  return `${mensagem} ${emojiMix}`;
}

export async function spam(faputa: any) {
  const numbers = (process.env.CONTACTS?.split(",") ?? []) as string[];
  const emojis = (process.env.EMOJIS?.split(",") ?? ["✨", "🎉", "🚀", "🔥"]) as string[];

  let count = 0;

  for (const number of numbers) {
    const jid = `${number.trim()}@s.whatsapp.net`;
    const { enviarTextospam } = setupMessagingServices(faputa, jid, null);

    // Gera uma variação diferente a cada envio
    const mensagemFinal = gerarVariacao(emojis);

    try {
      await enviarTextospam(mensagemFinal, jid);
      console.log(`✅ Mensagem enviada para ${jid}`);
    } catch (error) {
      console.error(`❌ Erro ao enviar mensagem para ${jid}`, error);
    }

    count++;

    // Intervalo aleatório entre 8–15 segundos
    const delay = 8000 + Math.random() * 7000;
    console.log(`⏳ Aguardando ${Math.round(delay / 1000)} segundos...`);
    await new Promise((res) => setTimeout(res, delay));

    // Pausa maior a cada 4 mensagens
    if (count % 4 === 0) {
      console.log("🕒 Pausa maior (60s) para evitar bloqueio...");
      await new Promise((res) => setTimeout(res, 60_000));
    }
  }
}
