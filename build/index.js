import { reng } from "./connection.js";
import { question } from "./exports/confs.js";
import fs from "fs";
import { exec, execSync } from 'child_process';
async function pico() {
    const authFolder = "db/qr-code";
    const resposta = await question("oq vc quer fazer? (1)logar (2) novo login: ");
    if (resposta === "1") {
        exec("yarn start");
        reng();
    }
    if (resposta === "2") {
        if (fs.existsSync(authFolder)) {
            fs.rmdirSync(authFolder, { recursive: true });
            console.log("pasta de autenticação deletada");
        }
        reng();
    }
    console.log("pico");
}
pico();
