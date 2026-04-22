import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const legalTemplates = [
  {
    name: "Contrato de Trabajo por Tiempo Indefinido",
    isGlobal: true,
    content: `# CONTRATO DE TRABAJO POR TIEMPO INDEFINIDO

ENTRE: De una parte, la sociedad [NOMBRE_EMPRESA], debidamente constituida conforme a las leyes de la República Dominicana, titular del RNC [RNC_EMPRESA], con su domicilio social en [DIRECCION_EMPRESA], representada por [REPRESENTANTE], quien en lo adelante se denominará LA EMPLEADORA; y de la otra parte, el señor/a [NOMBRE_EMPLEADO], dominicano, mayor de edad, titular de la Cédula de Identidad y Electoral No. [CEDULA_EMPLEADO], domiciliado y residente en [DIRECCION_EMPLEADO], quien en lo adelante se denominará EL EMPLEADO.

### SE HA CONVENIDO Y PACTADO LO SIGUIENTE:

**PRIMERO:** EL EMPLEADO se obliga a prestar sus servicios personales a LA EMPLEADORA en calidad de [PUESTO_TRABAJO], realizando las funciones propias de dicho cargo y aquellas que le sean instruidas por sus superiores.

**SEGUNDO:** La jornada de trabajo será de [HORARIO], cumpliendo con las 44 horas semanales establecidas por el Código de Trabajo de la República Dominicana.

**TERCERO:** Como remuneración por sus servicios, LA EMPLEADORA pagará a EL EMPLEADO la suma de RD$ [SALARIO] mensuales, pagaderos de forma quincenal/mensual, menos las deducciones de ley por seguridad social (TSS) e impuesto sobre la renta (ISR) si aplica.

**CUARTO:** El presente contrato se rige por las disposiciones del Código de Trabajo de la República Dominicana (Ley 16-92).

Hecho en dos (2) originales de un mismo tenor y efecto, en Santo Domingo, Distrito Nacional, a los [DIA] días del mes de [MES] del año [AÑO].`
  },
  {
    name: "Acto de Venta de Vehículo de Motor",
    isGlobal: true,
    content: `# ACTO DE VENTA DE VEHÍCULO DE MOTOR

ENTRE: El señor/a [VENDEDOR_NOMBRE], dominicano, mayor de edad, titular de la Cédula No. [VENDEDOR_CEDULA], en lo adelante denominado EL VENDEDOR; y el señor/a [COMPRADOR_NOMBRE], dominicano, mayor de edad, titular de la Cédula No. [COMPRADOR_CEDULA], en lo adelante denominado EL COMPRADOR.

### ANTECEDENTES Y OBJETO:

EL VENDEDOR, por medio del presente acto, VENDE, CEDE y TRANSFIERE, desde ahora y para siempre, con todas las garantías ordinarias y de derecho, en favor de EL COMPRADOR, el vehículo de motor que se describe a continuación:

- **MARCA:** [MARCA]
- **MODELO:** [MODELO]
- **AÑO:** [AÑO]
- **COLOR:** [COLOR]
- **CHASIS:** [CHASIS]
- **PLACA:** [PLACA]

**PRECIO:** El precio pactado para la presente venta es la suma de RD$ [PRECIO], los cuales EL VENDEDOR declara haber recibido de EL COMPRADOR a su entera satisfacción.

Hecho y firmado en Santo Domingo, República Dominicana, a los [DIA] días del mes de [MES] del año [AÑO].`
  },
  {
    name: "Contrato de Arrendamiento de Inmueble",
    isGlobal: true,
    content: `# CONTRATO DE ALQUILER / ARRENDAMIENTO

ENTRE: [PROPIETARIO_NOMBRE], (EL PROPIETARIO); y [INQUILINO_NOMBRE], (EL INQUILINO).

**PRIMERO:** EL PROPIETARIO alquila a EL INQUILINO el inmueble ubicado en [DIRECCION_INMUEBLE].

**SEGUNDO:** El precio del alquiler mensual es de RD$ [MONTO_ALQUILER], pagaderos los días [DIA_PAGO] de cada mes.

**TERCERO:** El contrato tendrá una duración de [DURACION] meses/años.

**CUARTO:** EL INQUILINO entrega en este acto la suma de [DEPOSITO] meses de depósito como garantía.

Hecho en Santo Domingo, República Dominicana, a los [DIA] del mes de [MES] del año [AÑO].`
  },
  {
    name: "Acta de Asamblea Constitutiva de SRL",
    isGlobal: true,
    content: `# ACTA DE ASAMBLEA GENERAL CONSTITUTIVA (SRL)

En la ciudad de [CIUDAD], República Dominicana, a los [DIA] días del mes de [MES] del año [AÑO].

**ORDEN DEL DÍA:**
1. Aprobación de los Estatutos Sociales.
2. Suscripción y pago del capital social.
3. Designación del Gerente.

**RESOLUCIONES:**
- Se acuerda la constitución de la sociedad [NOMBRE_SOCIEDAD] SRL.
- El capital social se fija en RD$ [CAPITAL].
- Se designa como Gerente a [NOMBRE_GERENTE].

Firmado por los socios fundadores:`
  },
  {
    name: "Liquidación de Prestaciones Laborales (Borrador)",
    isGlobal: true,
    content: `# CÁLCULO DE PRESTACIONES LABORALES

**EMPLEADO:** [NOMBRE_EMPLEADO]
**FECHA INGRESO:** [FECHA_INGRESO]
**FECHA SALIDA:** [FECHA_SALIDA]
**SALARIO PROMEDIO:** RD$ [SALARIO_PROMEDIO]

### DESGLOSE ESTIMADO:
- **Preaviso:** RD$ [PREAVISO]
- **Cesantía:** RD$ [CESANTIA]
- **Vacaciones No Disfrutadas:** RD$ [VACACIONES]
- **Regalía Pascual (Proporcional):** RD$ [REGALIA]

**TOTAL ESTIMADO:** RD$ [TOTAL_LIQUIDACION]

*Nota: Este documento es un borrador informativo basado en el Código de Trabajo Dominicano.*`
  }
];

async function main() {
  console.log('Seeding Legal Templates...');
  
  for (const item of legalTemplates) {
    try {
      await prisma.legalTemplate.create({
        data: item
      });
    } catch (error) {
      console.error(`Error seeding Legal Template ${item.name}:`, error);
    }
  }

  console.log('✅ Legal Templates seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
