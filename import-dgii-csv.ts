import fs from "fs";
import path from "path";
import { parse } from "csv-parse";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 📂 Carpeta donde el usuario guarda las actualizaciones del DGII
const RNC_FOLDER = `C:\\Users\\mende\\Desktop\\LISTADO RNC`;

// Auto-detecta el CSV más reciente dentro de la carpeta
function getLatestCsvFile(folderPath: string): string {
  const files = fs.readdirSync(folderPath)
    .filter(f => f.toLowerCase().endsWith(".csv") || f.toLowerCase().endsWith(".txt"))
    .map(f => ({
      name: f,
      fullPath: path.join(folderPath, f),
      mtime: fs.statSync(path.join(folderPath, f)).mtime.getTime()
    }))
    .sort((a, b) => b.mtime - a.mtime); // Más reciente primero

  if (files.length === 0) {
    throw new Error(`❌ No se encontró ningún archivo CSV en: ${folderPath}`);
  }

  console.log(`📄 Archivo detectado: ${files[0].name}`);
  return files[0].fullPath;
}

const BATCH_SIZE = 500;
let totalInserted = 0;
let totalSkipped = 0;
let batchNumber = 0;
const startTime = Date.now();

async function importRncData() {
  console.log("╔══════════════════════════════════════════════════╗");
  console.log("║   🇩🇴  IMPORTADOR DE RNC DGII — AETHERIUM AI     ║");
  console.log("╚══════════════════════════════════════════════════╝\n");

  const CSV_FILE_PATH = getLatestCsvFile(RNC_FOLDER);
  const fileSizeMB = (fs.statSync(CSV_FILE_PATH).size / 1024 / 1024).toFixed(1);

  console.log(`📊 Tamaño: ${fileSizeMB} MB`);
  console.log(`⚙️  Procesando en bloques de ${BATCH_SIZE} registros...\n`);

  // Contar registros actuales en DB antes de importar
  const existingCount = await prisma.dgiiRncRecord.count();
  console.log(`📦 Registros actuales en DB: ${existingCount.toLocaleString()}\n`);

  const records: any[] = [];

  const parser = fs.createReadStream(CSV_FILE_PATH, { encoding: "latin1" })
    .pipe(
      parse({
        columns: false,         // Posicional, no por nombre
        delimiter: ",",
        skip_empty_lines: true,
        trim: true,
        from_line: 2,           // Salta la cabecera
        relax_quotes: true,
        relax_column_count: true,
      })
    );

  for await (const row of parser) {
    const rnc = row[0]?.trim();
    if (!rnc) continue;

    records.push({
      rnc,
      razonSocial: row[1]?.trim() || "Desconocido",
      actividadEconomica: row[2]?.trim() || null,
      fechaInicioOperaciones: row[3]?.trim() || null,
      estado: row[4]?.trim() || null,
      regimenPago: row[5]?.trim() || null,
    });

    if (records.length >= BATCH_SIZE) {
      await upsertBatch([...records]);
      records.length = 0;
    }
  }

  if (records.length > 0) {
    await upsertBatch(records);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const finalCount = await prisma.dgiiRncRecord.count();

  console.log("\n╔══════════════════════════════════════════════════╗");
  console.log("║           ✅ IMPORTACIÓN COMPLETADA               ║");
  console.log("╠══════════════════════════════════════════════════╣");
  console.log(`║  📥 Nuevos insertados:  ${String(totalInserted).padEnd(25)}║`);
  console.log(`║  ⏭️  Omitidos (dupes):  ${String(totalSkipped).padEnd(25)}║`);
  console.log(`║  🗄️  Total en DB ahora: ${String(finalCount.toLocaleString()).padEnd(25)}║`);
  console.log(`║  ⏱️  Tiempo total:       ${String(elapsed + "s").padEnd(25)}║`);
  console.log("╚══════════════════════════════════════════════════╝");

  await prisma.$disconnect();
}

async function upsertBatch(batchData: any[]) {
  batchNumber++;
  try {
    const result = await prisma.dgiiRncRecord.createMany({
      data: batchData,
      skipDuplicates: true,
    });
    totalInserted += result.count;
    totalSkipped += batchData.length - result.count;

    const elapsed = (Date.now() - startTime) / 1000;
    const rate = Math.round(totalInserted / elapsed);
    process.stdout.write(
      `\r⚙️  Bloque #${batchNumber} | Procesados: ${(totalInserted + totalSkipped).toLocaleString()} | Nuevos: ${totalInserted.toLocaleString()} | ~${rate}/s   `
    );
  } catch (error) {
    console.error(`\n❌ Error en bloque #${batchNumber}:`, error);
  }
}

importRncData().catch((e) => {
  console.error("Error fatal:", e);
  prisma.$disconnect();
  process.exit(1);
});
