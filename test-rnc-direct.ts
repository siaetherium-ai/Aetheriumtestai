import axios from 'axios';

async function testRncSearch() {
  console.log("🔍 Probando búsqueda de RNC directamente contra el servidor local...");
  
  try {
    // Primero necesitamos un token. Usamos un usuario administrativo o el que se usa en los tests.
    // Para simplificar, si no tenemos token, probamos la DB directamente.
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    console.log("--- Prueba 1: Conteo en Base de Datos ---");
    const count = await prisma.dgiiRncRecord.count();
    console.log(`📊 Total de registros en DB: ${count.toLocaleString()}`);

    console.log("\n--- Prueba 2: Búsqueda de un RNC conocido (CERVECERIA) ---");
    const results = await prisma.dgiiRncRecord.findMany({
      where: {
        OR: [
          { rnc: { contains: '101000011', mode: 'insensitive' } },
          { razonSocial: { contains: 'CERVECERIA', mode: 'insensitive' } }
        ]
      },
      take: 5
    });

    if (results.length > 0) {
      console.log(`✅ ¡Éxito! Se encontraron ${results.length} coincidencias.`);
      results.forEach(r => {
        console.log(`   - [${r.rnc}] ${r.razonSocial} | ${r.estado}`);
      });
    } else {
      console.log("❌ No se encontraron resultados. Algo falló con la data.");
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Error durante la prueba:", error);
  }
}

testRncSearch();
