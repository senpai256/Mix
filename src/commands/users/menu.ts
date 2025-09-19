import { setupMessagingServices } from "../../exports/messages.js";
import { menuCaption } from "../handle/index.js";
//



export async function menu(faputa: any, from: string, m: string) {
    const { enviarTexto, enviarAudioGravacao, enviarImagem } = setupMessagingServices(faputa, from, m);

    
    try{
        await enviarAudioGravacao("./db/assets/audio/mm.mp3")
    await enviarImagem("db/assets/img/neko.png",menuCaption(m))  
    
    } catch (error){
     console.log("errror")
    }
}