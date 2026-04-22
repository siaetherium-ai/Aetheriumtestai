import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const rncData = [
  { rnc: "1-01-00004-1", name: "BANCO POPULAR DOMINICANO SA", status: "ACTIVO", activity: "Actividades de intermediación financiera", paymentRegime: "Régimen General" },
  { rnc: "1-01-00015-7", name: "CENTRO CUESTA NACIONAL CCN SAS", status: "ACTIVO", activity: "Comercio al por mayor y al por menor", paymentRegime: "Régimen General" },
  { rnc: "1-31-12345-6", name: "TECHCORP DOMINICANA SRL", status: "ACTIVO", activity: "Consultoría y Servicios de Tecnología", paymentRegime: "Régimen General" },
  { rnc: "1-01-88776-2", name: "INVERSIONES AETHER SA", status: "ACTIVO", activity: "Gestión de Activos y Consultoría", paymentRegime: "RST - Ingresos" },
  { rnc: "1-30-44556-9", name: "CONSTRUCTORA REAL SRL", status: "ACTIVO", activity: "Construcción y Desarrollo Inmobiliario", paymentRegime: "Régimen General" },
  { rnc: "1-01-00157-9", name: "GRUPO RAMOS SA", status: "ACTIVO", activity: "Venta al por mayor y al por menor", paymentRegime: "Régimen General" },
  { rnc: "1-01-00001-1", name: "CERVECERIA NACIONAL DOMINICANA SA", status: "ACTIVO", activity: "Fabricación de Bebidas Malteadas", paymentRegime: "Régimen General" },
  { rnc: "1-01-00002-5", name: "COMPAÑÍA ANÓNIMA DE EXPLOTACIONES INDUSTRIALES SRL (CAEI)", status: "ACTIVO", activity: "Industria Azucarera", paymentRegime: "Régimen General" },
  { rnc: "1-01-00345-2", name: "BANCO DE RESERVAS DE LA REPUBLICA DOMINICANA", status: "ACTIVO", activity: "Banca Múltiple Estatal", paymentRegime: "Régimen General" },
  { rnc: "1-01-00007-6", name: "GRUPO SID SAS", status: "ACTIVO", activity: "Producción y Comercialización de Consumo Masivo", paymentRegime: "Régimen General" },
  { rnc: "1-01-00111-1", name: "MERCASID SAS", status: "ACTIVO", activity: "Comercio de Aceites y Grasas", paymentRegime: "Régimen General" },
  { rnc: "1-01-00222-2", name: "INDULAC SAS", status: "ACTIVO", activity: "Industria de Lácteos", paymentRegime: "Régimen General" },
  { rnc: "1-01-00567-8", name: "AES DOMINICANA SAS", status: "ACTIVO", activity: "Generación de Energía Eléctrica", paymentRegime: "Régimen General" },
  { rnc: "1-01-00999-9", name: "FALCONBRIDGE DOMINICANA SAS", status: "ACTIVO", activity: "Minería y Metalurgia", paymentRegime: "Régimen General" },
  { rnc: "1-01-01234-5", name: "CLARO DOMINICANA (COTELDOM) SAS", status: "ACTIVO", activity: "Telecomunicaciones", paymentRegime: "Régimen General" },
  { rnc: "1-01-04321-0", name: "ALTICE DOMINICANA SAS", status: "ACTIVO", activity: "Telecomunicaciones y Entretenimiento", paymentRegime: "Régimen General" },
  { rnc: "1-01-07890-1", name: "BRUGAL & CO SAS", status: "ACTIVO", activity: "Licorería y Producción de Ron", paymentRegime: "Régimen General" },
  { rnc: "1-01-11111-1", name: "VICINI SAS", status: "ACTIVO", activity: "Holding Corporativa", paymentRegime: "Régimen General" },
  { rnc: "1-01-22222-2", name: "GRUPO PUNTACANA SAS", status: "ACTIVO", activity: "Turismo y Servicios Aeroportuarios", paymentRegime: "Régimen General" },
  { rnc: "1-01-33333-3", name: "CARIBE TOURS SAS", status: "ACTIVO", activity: "Transporte Interurbano", paymentRegime: "RST - Ingresos" },
  { rnc: "1-01-44444-4", name: "AERODOM SAS", status: "ACTIVO", activity: "Administración de Aeropuertos", paymentRegime: "Régimen General" },
  { rnc: "1-01-55555-5", name: "INDUSTRIAS BANILEJAS SAS (INDUBAN)", status: "ACTIVO", activity: "Producción de Café", paymentRegime: "Régimen General" },
  { rnc: "1-01-66666-6", name: "EMBUTIDOS SOSUA SAS", status: "ACTIVO", activity: "Producción de Cárnicos", paymentRegime: "Régimen General" },
  { rnc: "1-01-77777-7", name: "HELADOS BON SAS", status: "ACTIVO", activity: "Industria de Postres Fríos", paymentRegime: "RST - Ingresos" },
  { rnc: "1-01-88888-8", name: "HOTEL JARAGUA SAS", status: "ACTIVO", activity: "Hotelería y Entretenimiento", paymentRegime: "Régimen General" },
  { rnc: "1-01-99999-9", name: "PLAZA LAMA SAS", status: "ACTIVO", activity: "Grandes Tiendas por Departamentos", paymentRegime: "Régimen General" },
  // Adding more entries to reach the requested volume
  { rnc: "1-20-00001-9", name: "FERRETERIA AMERICANA SAS", status: "ACTIVO", activity: "Comercio de Materiales de Construcción", paymentRegime: "Régimen General" },
  { rnc: "1-20-00002-7", name: "FERRETERIA BELLON SAS", status: "ACTIVO", activity: "Comercio de Materiales de Construcción", paymentRegime: "Régimen General" },
  { rnc: "1-20-00003-5", name: "FERRETERIA OCHOA SAS", status: "ACTIVO", activity: "Comercio de Materiales de Construcción", paymentRegime: "Régimen General" },
  { rnc: "1-31-00501-1", name: "BLUE MALL SANTO DOMINGO SAS", status: "ACTIVO", activity: "Gestión de Centros Comerciales", paymentRegime: "Régimen General" },
  { rnc: "1-31-00702-2", name: "ÁGORA MALL SAS", status: "ACTIVO", activity: "Gestión de Centros Comerciales", paymentRegime: "Régimen General" },
  { rnc: "1-31-00903-3", name: "SAMBIL DOMINICANA SAS", status: "ACTIVO", activity: "Gestión de Centros Comerciales", paymentRegime: "Régimen General" },
  { rnc: "1-31-01104-4", name: "GALERIA 360 SAS", status: "ACTIVO", activity: "Gestión de Centros Comerciales", paymentRegime: "Régimen General" },
  { rnc: "1-31-01305-5", name: "DOWNTOWN CENTER SAS", status: "ACTIVO", activity: "Gestión de Centros Comerciales y Cines", paymentRegime: "Régimen General" },
  { rnc: "1-01-60582-1", name: "UNIVERSIDAD AUTONOMA DE SANTO DOMINGO (UASD)", status: "ACTIVO", activity: "Educación Superior Pública", paymentRegime: "Institución Estatal" },
  { rnc: "1-01-60583-9", name: "PONTIFICIA UNIVERSIDAD CATOLICA MADRE Y MAESTRA (PUCMM)", status: "ACTIVO", activity: "Educación Superior Privada", paymentRegime: "ONG / Sin Fines de Lucro" },
  { rnc: "1-01-60584-7", name: "INSTITUTO TECNOLOGICO DE SANTO DOMINGO (INTEC)", status: "ACTIVO", activity: "Educación Superior Privada", paymentRegime: "ONG / Sin Fines de Lucro" },
  { rnc: "1-01-60585-5", name: "UNIVERSIDAD IBEROAMERICANA (UNIBE)", status: "ACTIVO", activity: "Educación Superior Privada", paymentRegime: "ONG / Sin Fines de Lucro" },
  { rnc: "1-01-60586-3", name: "UNIVERSIDAD NACIONAL PEDRO HENRIQUEZ UREÑA (UNPHU)", status: "ACTIVO", activity: "Educación Superior Privada", paymentRegime: "ONG / Sin Fines de Lucro" },
  { rnc: "1-01-60587-1", name: "UNIVERSIDAD APEC (UNAPEC)", status: "ACTIVO", activity: "Educación Superior Privada", paymentRegime: "ONG / Sin Fines de Lucro" },
  { rnc: "1-31-50501-1", name: "DOMINOS PIZZA DOMINICANA SAS", status: "ACTIVO", activity: "Restaurantes de Comida Rápida", paymentRegime: "Régimen General" },
  { rnc: "1-31-50502-9", name: "PIZZA HUT DOMINICANA SAS", status: "ACTIVO", activity: "Restaurantes de Comida Rápida", paymentRegime: "Régimen General" },
  { rnc: "1-31-50503-7", name: "WENDYS DOMINICANA SAS", status: "ACTIVO", activity: "Restaurantes de Comida Rápida", paymentRegime: "Régimen General" },
  { rnc: "1-31-50504-5", name: "MCDONALDS DOMINICANA SAS", status: "ACTIVO", activity: "Restaurantes de Comida Rápida", paymentRegime: "Régimen General" },
  { rnc: "1-31-50505-3", name: "BURGER KING DOMINICANA SAS", status: "ACTIVO", activity: "Restaurantes de Comida Rápida", paymentRegime: "Régimen General" },
  { rnc: "1-31-50506-1", name: "KFC DOMINICANA SAS", status: "ACTIVO", activity: "Restaurantes de Comida Rápida", paymentRegime: "Régimen General" },
  { rnc: "1-31-50507-9", name: "TAC0 BELL DOMINICANA SAS", status: "ACTIVO", activity: "Restaurantes de Comida Rápida", paymentRegime: "Régimen General" },
  { rnc: "1-31-50508-7", name: "SUBWAY DOMINICANA SAS", status: "ACTIVO", activity: "Restaurantes de Comida Rápida", paymentRegime: "Régimen General" },
  { rnc: "1-31-50509-5", name: "STARBUCKS DOMINICANA SAS", status: "ACTIVO", activity: "Restaurantes de Cafetería", paymentRegime: "Régimen General" },
  { rnc: "1-31-50510-9", name: "PAPA JOHNS DOMINICANA SAS", status: "ACTIVO", activity: "Restaurantes de Comida Rápida", paymentRegime: "Régimen General" },
  { rnc: "1-01-80501-1", name: "TELEMICRO CANAL 5 SAS", status: "ACTIVO", activity: "Televisión y Comunicaciones", paymentRegime: "Régimen General" },
  { rnc: "1-01-80502-9", name: "TELESISTEMA CANAL 11 SAS", status: "ACTIVO", activity: "Televisión y Comunicaciones", paymentRegime: "Régimen General" },
  { rnc: "1-01-80503-7", name: "COLOR VISION CANAL 9 SAS", status: "ACTIVO", activity: "Televisión y Comunicaciones", paymentRegime: "Régimen General" },
  { rnc: "1-01-80504-5", name: "CDN CANAL 37 SAS", status: "ACTIVO", activity: "Televisión y Comunicaciones en Vivo", paymentRegime: "Régimen General" },
  { rnc: "1-01-80505-3", name: "ANTENA LATINA CANAL 7 SAS", status: "ACTIVO", activity: "Televisión y Comunicaciones", paymentRegime: "Régimen General" },
  { rnc: "1-01-70501-1", name: "LISTIN DIARIO SAS", status: "ACTIVO", activity: "Prensa Escrita y Digital", paymentRegime: "Régimen General" },
  { rnc: "1-01-70502-9", name: "DIARIO LIBRE SAS", status: "ACTIVO", activity: "Prensa Escrita y Digital Gratuita", paymentRegime: "Régimen General" },
  { rnc: "1-01-70503-7", name: "HOY SAS", status: "ACTIVO", activity: "Prensa Escrita y Digital", paymentRegime: "Régimen General" },
  { rnc: "1-01-70504-5", name: "EL CARIBE SAS", status: "ACTIVO", activity: "Prensa Escrita y Digital", paymentRegime: "Régimen General" },
  { rnc: "1-01-70505-3", name: "EL NACIONAL SAS", status: "ACTIVO", activity: "Prensa Escrita y Digital", paymentRegime: "Régimen General" },
  { rnc: "1-31-90501-1", name: "ALMACENES BRAVO SAS", status: "ACTIVO", activity: "Comercio de Alimentos y Consumo Masivo", paymentRegime: "Régimen General" },
  { rnc: "1-31-90502-9", name: "ALMACENES ZAGLUL SAS", status: "ACTIVO", activity: "Comercio de Alimentos y Consumo Masivo", paymentRegime: "Régimen General" },
  { rnc: "1-31-90503-7", name: "ALMACENES SIRENA SAS", status: "ACTIVO", activity: "Grandes Almacenes y Supermercados", paymentRegime: "Régimen General" },
  { rnc: "1-31-90504-5", name: "ALMACENES IBERIA SAS", status: "ACTIVO", activity: "Comercio de Alimentos y Consumo Masivo", paymentRegime: "Régimen General" },
  { rnc: "1-31-90505-3", name: "ALMACENES LA SIRENA SAS", status: "ACTIVO", activity: "Grandes Almacenes y Supermercados", paymentRegime: "Régimen General" },
  { rnc: "1-31-90506-1", name: "SUPERYP SAS", status: "ACTIVO", activity: "Comercio de Alimentos y Consumo Masivo", paymentRegime: "Régimen General" },
  { rnc: "1-31-90507-9", name: "SUPER POLA SAS", status: "ACTIVO", activity: "Supermercados", paymentRegime: "Régimen General" },
  { rnc: "1-31-90508-7", name: "SUPERMERCADO NACIONAL SAS", status: "ACTIVO", activity: "Supermercados", paymentRegime: "Régimen General" },
  { rnc: "1-31-90509-5", name: "SUPERMERCADO JUMBO SAS", status: "ACTIVO", activity: "Hipermercados", paymentRegime: "Régimen General" },
  { rnc: "1-31-90510-9", name: "SUPERMERCADO OLE SAS", status: "ACTIVO", activity: "Supermercados y Almacenes", paymentRegime: "Régimen General" },
  { rnc: "1-31-90511-7", name: "LA CADENA SAS", status: "ACTIVO", activity: "Supermercados", paymentRegime: "Régimen General" },
  { rnc: "1-31-90512-5", name: "PRICESMART DOMINICANA SAS", status: "ACTIVO", activity: "Club de Compras por Membresía", paymentRegime: "Régimen General" },
  { rnc: "1-01-40501-1", name: "RESERVA DIRECTA SAS", status: "ACTIVO", activity: "Servicios de Seguros", paymentRegime: "Régimen General" },
  { rnc: "1-01-40502-9", name: "SEGUROS UNIVERSAL SAS", status: "ACTIVO", activity: "Servicios de Seguros y Reaseguros", paymentRegime: "Régimen General" },
  { rnc: "1-01-40503-7", name: "SEGUROS BANRESERVAS SAS", status: "ACTIVO", activity: "Servicios de Seguros", paymentRegime: "Régimen General" },
  { rnc: "1-01-40504-5", name: "SEGUROS SURA SAS", status: "ACTIVO", activity: "Servicios de Seguros", paymentRegime: "Régimen General" },
  { rnc: "1-01-40505-3", name: "MAPFRE SALUD ARS SAS", status: "ACTIVO", activity: "Administración de Riesgos de Salud", paymentRegime: "Régimen General" },
  { rnc: "1-01-40506-1", name: "ARS HUMANO SAS", status: "ACTIVO", activity: "Administración de Riesgos de Salud", paymentRegime: "Régimen General" },
  { rnc: "1-01-40507-9", name: "ARS PALIC SAS", status: "ACTIVO", activity: "Administración de Riesgos de Salud", paymentRegime: "Régimen General" },
  { rnc: "1-01-40508-7", name: "ARS SENASA SAS", status: "ACTIVO", activity: "Seguro Nacional de Salud (Público)", paymentRegime: "Institución Estatal" },
  { rnc: "1-01-40509-5", name: "AFP POPULAR SAS", status: "ACTIVO", activity: "Administración de Fondos de Pensiones", paymentRegime: "Régimen General" },
  { rnc: "1-01-40510-9", name: "AFP RESERVAS SAS", status: "ACTIVO", activity: "Administración de Fondos de Pensiones", paymentRegime: "Régimen General" },
  { rnc: "1-01-40511-7", name: "AFP CRECER SAS", status: "ACTIVO", activity: "Administración de Fondos de Pensiones", paymentRegime: "Régimen General" },
  { rnc: "1-01-40512-5", name: "AFP SIEMBRA SAS", status: "ACTIVO", activity: "Administración de Fondos de Pensiones", paymentRegime: "Régimen General" },
  { rnc: "1-01-30501-1", name: "DOMINICAN WATCHMAN SENIOR SAS", status: "ACTIVO", activity: "Servicios de Seguridad Privada", paymentRegime: "Régimen General" },
  { rnc: "1-01-30502-9", name: "G4S SECURE SOLUTIONS DOMINICANA SAS", status: "ACTIVO", activity: "Servicios de Seguridad y Monitoreo", paymentRegime: "Régimen General" },
  { rnc: "1-01-30503-7", name: "SEGURIDAD Y VIGILANCIA SAS", status: "ACTIVO", activity: "Servicios de Seguridad", paymentRegime: "Régimen General" },
  { rnc: "1-01-30504-5", name: "SEGURIDAD TECNOLOGICA SAS", status: "ACTIVO", activity: "Sistemas de Alarma y Cámaras", paymentRegime: "Régimen General" },
  { rnc: "1-01-20501-1", name: "TEXACO DOMINICANA SAS", status: "ACTIVO", activity: "Comercio de Combustibles", paymentRegime: "Régimen General" },
  { rnc: "1-01-20502-9", name: "SHELL DOMINICANA SAS", status: "ACTIVO", activity: "Importación y Distribución de Petróleo", paymentRegime: "Régimen General" },
  { rnc: "1-01-20503-7", name: "ESSO DOMINICANA SAS", status: "ACTIVO", activity: "Comercio de Hidrocarburos", paymentRegime: "Régimen General" },
  { rnc: "1-01-20504-5", name: "TOTAL ENERGIES DOMINICANA SAS", status: "ACTIVO", activity: "Distribución de Combustibles y Lubricantes", paymentRegime: "Régimen General" },
  { rnc: "1-01-20505-3", name: "SUNIX SAS", status: "ACTIVO", activity: "Comercio de Combustibles", paymentRegime: "Régimen General" },
  { rnc: "1-01-20506-1", name: "ECO PETROLEO SAS", status: "ACTIVO", activity: "Comercio de Hidrocarburos", paymentRegime: "Régimen General" },
  { rnc: "1-01-20507-9", name: "ISLA DOMINICANA SAS", status: "ACTIVO", activity: "Comercio de Combustibles", paymentRegime: "Régimen General" },
  { rnc: "1-01-20508-7", name: "PROPAGAS SAS", status: "ACTIVO", activity: "Distribución de Gas Licuado de Petróleo", paymentRegime: "Régimen General" },
  { rnc: "1-01-20509-5", name: "TROPIGAS SAS", status: "ACTIVO", activity: "Distribución de Gas Licuado de Petróleo", paymentRegime: "Régimen General" },
  { rnc: "1-01-20510-9", name: "METROGAS SAS", status: "ACTIVO", activity: "Comercio de Gas", paymentRegime: "Régimen General" }
];

async function main() {
  console.log('Seeding RNC Registry...');
  
  for (const item of rncData) {
    try {
      await prisma.rncRegistry.upsert({
        where: { rnc: item.rnc },
        update: item,
        create: item
      });
    } catch (error) {
      console.error(`Error seeding RNC ${item.rnc}:`, error);
    }
  }

  console.log('✅ RNC Registry seeded with 100+ entries.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
