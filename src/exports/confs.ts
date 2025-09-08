import readline from 'readline';
import pino from 'pino';
import path from 'path';
import { fileURLToPath } from 'url';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
export const question = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
}

export const logger = pino({ level: 'silent' });

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
