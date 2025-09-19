import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

// Caminho do arquivo com os números originais (um por linha)
const inputFile = resolve(__dirname, "numeros.txt");
// Caminho do arquivo onde a lista transformada será salva
const outputFile = resolve(__dirname, "numeros_formatados.txt");

// Lê os números do arquivo
const rawData = readFileSync(inputFile, "utf-8");

// Quebra em linhas e filtra linhas vazias
const numbers = rawData.split(/\r?\n/).filter(line => line.trim() !== "");

// Função para processar cada número
function formatNumber(number) {
  const clean = number.replace(/\D/g, ""); // remove qualquer caractere não numérico
  if (clean.length < 3) return clean;      // ignora números curtos
  // Remove o 3º dígito
  const newNumber = clean.slice(0, 2) + clean.slice(3);
  // Adiciona 55 no início
  return "55" + newNumber;
}

// Aplica a transformação a todos os números
const formatted = numbers.map(formatNumber);

// Junta todos os números com vírgula
const outputString = formatted.join(",");

// Salva no arquivo de saída
writeFileSync(outputFile, outputString, "utf-8");

console.log(`✅ Lista formatada com vírgulas salva em: ${outputFile}`);
