import { OvertimeEntry, MonthlyStats, Settings } from '../types';

/**
 * Calcule la durée entre deux horaires en heures décimales.
 * Ex: "08:00" -> "10:30" = 2.5
 */
export function calculateHours(startTime: string, endTime: string): number {
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  let totalMinutes = (endH * 60 + endM) - (startH * 60 + startM);

  // Si l'heure de fin est avant l'heure de début, on considère que c'est le lendemain
  if (totalMinutes < 0) {
    totalMinutes += 24 * 60;
  }

  return Math.round((totalMinutes / 60) * 100) / 100;
}

/**
 * Répartit les heures supp entre majoration 25% et 50%.
 * Droit français : 25% pour les 8 premières heures supp (35h -> 43h),
 * puis 50% au-delà.
 */
export function calculateOvertimeBreakdown(
  totalWeeklyHours: number,
  settings: Settings
): { hoursAt25: number; hoursAt50: number } {
  const overtimeHours = Math.max(0, totalWeeklyHours - settings.rate25Threshold);

  const maxAt25 = settings.rate50Threshold - settings.rate25Threshold; // par défaut 8h
  const hoursAt25 = Math.min(overtimeHours, maxAt25);
  const hoursAt50 = Math.max(0, overtimeHours - maxAt25);

  return {
    hoursAt25: Math.round(hoursAt25 * 100) / 100,
    hoursAt50: Math.round(hoursAt50 * 100) / 100,
  };
}

/**
 * Calcule les statistiques mensuelles à partir des entrées.
 */
export function calculateMonthlyStats(
  entries: OvertimeEntry[],
  month: string,
  settings: Settings
): MonthlyStats {
  const totalHours = entries.reduce((sum, e) => sum + e.total_hours, 0);
  const uniqueDays = new Set(entries.map(e => e.date)).size;
  const averagePerDay = uniqueDays > 0 ? totalHours / uniqueDays : 0;

  // Calcul simplifié : on répartit le total mensuel selon les seuils
  const { hoursAt25, hoursAt50 } = calculateOvertimeBreakdown(
    settings.weeklyLegalHours + totalHours, // simulation hebdo
    settings
  );

  return {
    month,
    totalHours: Math.round(totalHours * 100) / 100,
    totalEntries: entries.length,
    averagePerDay: Math.round(averagePerDay * 100) / 100,
    hoursAt25,
    hoursAt50,
  };
}

/**
 * Formate un nombre d'heures décimales en "Xh Ymin".
 */
export function formatHours(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${h}h`;
  return `${h}h${String(m).padStart(2, '0')}`;
}

/**
 * Calcule le montant brut des heures supp.
 */
export function calculateOvertimeAmount(
  hoursAt25: number,
  hoursAt50: number,
  hourlyRate: number
): number {
  const amount25 = hoursAt25 * hourlyRate * 1.25;
  const amount50 = hoursAt50 * hourlyRate * 1.50;
  return Math.round((amount25 + amount50) * 100) / 100;
}
