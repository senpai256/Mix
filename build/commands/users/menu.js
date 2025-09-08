import { setupMessagingServices } from "../../exports/messages.js";
import { menuCaption } from "../handle/index.js";
export async function menu(faputa, from, m) {
    const { enviarImagem, enviarTexto, enviarAudioGravacao } = setupMessagingServices(faputa, from, m);
    try {
        await enviarAudioGravacao("db/assets/audio/mm.mp3");
        await enviarImagem("db/assets/img/neko.png", menuCaption(m));
    }
    catch (error) {
        console.error("Erro ao enviar o menu:", error);
        await enviarTexto("Ocorreu um erro ao enviar o menu. Por favor, tente novamente mais tarde.");
    }
}
