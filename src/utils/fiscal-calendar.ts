/**
 * Utilidades para el Calendario Fiscal de la República Dominicana (DGII)
 */

export const getFiscalPeriod = (date: Date = new Date()): string => {
  // El periodo fiscal a reportar es usualmente el mes anterior
  const d = new Date(date);
  d.setMonth(d.getMonth() - 1);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  return `${year}${month}`;
};

export const getNextDeadline606 = (date: Date = new Date()): Date => {
  // Los formatos 606 y 607 se presentan el día 15 del mes siguiente
  const d = new Date(date);
  d.setDate(15);
  // Si hoy es después del 15, el próximo 15 es el del mes que viene
  if (date.getDate() > 15) {
    d.setMonth(d.getMonth() + 1);
  }
  return d;
};

export const getNextDeadlineIT1 = (date: Date = new Date()): Date => {
  // El IT-1 se presenta y paga el día 20 del mes siguiente
  const d = new Date(date);
  d.setDate(20);
  if (date.getDate() > 20) {
    d.setMonth(d.getMonth() + 1);
  }
  return d;
};

export const getDaysUntil = (target: Date): number => {
  const diff = target.getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const formatFiscalDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getFiscalMonthName = (date: Date = new Date()): string => {
  const d = new Date(date);
  d.setMonth(d.getMonth() - 1);
  return d.toLocaleString('es-DO', { month: 'long', year: 'numeric' });
};
