import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { OvertimeEntry, MonthlyStats, Settings } from '../types';
import { MONTHS_FR } from '../constants';
import { formatHours, calculateOvertimeAmount } from './overtime';

function getMonthLabel(yearMonth: string): string {
  const [year, month] = yearMonth.split('-');
  return `${MONTHS_FR[parseInt(month, 10) - 1]} ${year}`;
}

function generateHTML(
  entries: OvertimeEntry[],
  stats: MonthlyStats,
  settings: Settings
): string {
  const monthLabel = getMonthLabel(stats.month);
  const amount = settings.hourlyRate > 0
    ? calculateOvertimeAmount(stats.hoursAt25, stats.hoursAt50, settings.hourlyRate)
    : null;

  const rows = entries
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(e => `
      <tr>
        <td>${new Date(e.date).toLocaleDateString('fr-FR')}</td>
        <td>${e.start_time}</td>
        <td>${e.end_time}</td>
        <td><strong>${formatHours(e.total_hours)}</strong></td>
        <td>${e.note}</td>
      </tr>
    `).join('');

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
        h1 { color: #1565C0; border-bottom: 2px solid #1565C0; padding-bottom: 10px; }
        .info { margin-bottom: 20px; color: #666; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #1565C0; color: white; padding: 10px; text-align: left; }
        td { padding: 8px 10px; border-bottom: 1px solid #ddd; }
        tr:nth-child(even) { background: #f9f9f9; }
        .summary { background: #E3F2FD; padding: 15px; border-radius: 8px; margin-top: 20px; }
        .summary h3 { margin-top: 0; color: #1565C0; }
        .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .summary-item { padding: 5px 0; }
        .label { color: #666; }
        .value { font-weight: bold; font-size: 1.1em; }
        .footer { margin-top: 30px; text-align: center; color: #999; font-size: 0.8em; }
      </style>
    </head>
    <body>
      <h1>Heures Supplementaires - ${monthLabel}</h1>
      <div class="info">
        ${settings.employeeName ? `<p><strong>Employe :</strong> ${settings.employeeName}</p>` : ''}
        ${settings.companyName ? `<p><strong>Entreprise :</strong> ${settings.companyName}</p>` : ''}
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Debut</th>
            <th>Fin</th>
            <th>Duree</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <div class="summary">
        <h3>Recapitulatif</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <span class="label">Total heures supp :</span>
            <span class="value">${formatHours(stats.totalHours)}</span>
          </div>
          <div class="summary-item">
            <span class="label">Nombre de jours :</span>
            <span class="value">${stats.totalEntries}</span>
          </div>
          <div class="summary-item">
            <span class="label">Moyenne / jour :</span>
            <span class="value">${formatHours(stats.averagePerDay)}</span>
          </div>
          <div class="summary-item">
            <span class="label">Heures a 25% :</span>
            <span class="value">${formatHours(stats.hoursAt25)}</span>
          </div>
          <div class="summary-item">
            <span class="label">Heures a 50% :</span>
            <span class="value">${formatHours(stats.hoursAt50)}</span>
          </div>
          ${amount !== null ? `
          <div class="summary-item">
            <span class="label">Montant brut estime :</span>
            <span class="value">${amount.toFixed(2)} EUR</span>
          </div>
          ` : ''}
        </div>
      </div>

      <div class="footer">
        <p>Document genere par Heures Supp Tracker</p>
      </div>
    </body>
    </html>
  `;
}

export async function generateAndSharePDF(
  entries: OvertimeEntry[],
  stats: MonthlyStats,
  settings: Settings
): Promise<void> {
  const html = generateHTML(entries, stats, settings);
  const monthLabel = getMonthLabel(stats.month).replace(' ', '-');

  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
  });

  await Sharing.shareAsync(uri, {
    mimeType: 'application/pdf',
    dialogTitle: `Heures Supp - ${monthLabel}`,
    UTI: 'com.adobe.pdf',
  });
}
