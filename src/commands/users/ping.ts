import { setupMessagingServices } from "../../exports/messages.js";

export async function ping(faputa: any, from: string, m: any) {
  const { enviarTexto } = setupMessagingServices(faputa, from, m);
  await enviarTexto("Pong!");
}

