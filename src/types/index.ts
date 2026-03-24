export interface OvertimeEntry {
  id: number;
  date: string; // format YYYY-MM-DD
  start_time: string; // format HH:mm
  end_time: string; // format HH:mm
  total_hours: number; // durée totale en heures décimales
  note: string;
  created_at: string;
}

export interface OvertimeRate {
  label: string;
  threshold: number; // seuil en heures hebdo
  rate: number; // ex: 1.25 pour 25%
}

export interface MonthlyStats {
  month: string; // format YYYY-MM
  totalHours: number;
  totalEntries: number;
  averagePerDay: number;
  hoursAt25: number; // heures majorées à 25%
  hoursAt50: number; // heures majorées à 50%
}

export interface Settings {
  weeklyLegalHours: number; // heures légales par semaine (défaut 35)
  rate25Threshold: number; // seuil pour majoration 25% (défaut 35)
  rate50Threshold: number; // seuil pour majoration 50% (défaut 43)
  hourlyRate: number; // taux horaire brut en €
  companyName: string;
  employeeName: string;
}
