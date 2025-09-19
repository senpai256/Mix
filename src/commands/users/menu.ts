import { setupMessagingServices } from "../../exports/messages.js";
//



export async function menu(faputa: any, from: string, m: any) {
    const { enviarTexto, enviarAudioGravacao, enviarImagem } = setupMessagingServices(faputa, from, m);

    
    try{
        await enviarAudioGravacao("assets/audios/mmmp3")
    await enviarImagem("assets/imgs/neko.png")  

    } catch (error){
     console.log("errror")
    }
}