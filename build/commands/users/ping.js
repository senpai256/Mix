import { setupMessagingServices } from "../../exports/messages.js";
export async function ping(faputa, from, m) {
    const { enviarTexto } = setupMessagingServices(faputa, from, m);
    await enviarTexto("Pong!");
}
