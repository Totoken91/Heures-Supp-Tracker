import { useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useFocusEffect } from 'expo-router';
import { useAppStore } from '../../src/store';
import { calculateMonthlyStats, formatHours, calculateOvertimeAmount } from '../../src/utils/overtime';
import { generateAndSharePDF } from '../../src/utils/pdf';
import { COLORS, MONTHS_FR } from '../../src/constants';

export default function StatsScreen() {
  const entries = useAppStore((s) => s.entries);
  const currentMonth = useAppStore((s) => s.currentMonth);
  const settings = useAppStore((s) => s.settings);
  const loadEntries = useAppStore((s) => s.loadEntries);

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [currentMonth])
  );

  const stats = calculateMonthlyStats(entries, currentMonth, settings);
  const [year, month] = currentMonth.split('-').map(Number);
  const monthLabel = `${MONTHS_FR[month - 1]} ${year}`;

  const amount = settings.hourlyRate > 0
    ? calculateOvertimeAmount(stats.hoursAt25, stats.hoursAt50, settings.hourlyRate)
    : null;

  const handleExportPDF = async () => {
    await generateAndSharePDF(entries, stats, settings);
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>{monthLabel}</Text>

      <View style={styles.grid}>
        <StatCard
          label="Total heures supp"
          value={formatHours(stats.totalHours)}
          icon="clock-outline"
          color={COLORS.primary}
        />
        <StatCard
          label="Nombre d'entrées"
          value={String(stats.totalEntries)}
          icon="calendar-check"
          color={COLORS.accent}
        />
        <StatCard
          label="Moyenne / jour"
          value={formatHours(stats.averagePerDay)}
          icon="chart-timeline-variant"
          color={COLORS.success}
        />
        <StatCard
          label="Heures à 25%"
          value={formatHours(stats.hoursAt25)}
          icon="percent"
          color={COLORS.warning}
        />
        <StatCard
          label="Heures à 50%"
          value={formatHours(stats.hoursAt50)}
          icon="percent"
          color={COLORS.error}
        />
        {amount !== null && (
          <StatCard
            label="Montant brut estimé"
            value={`${amount.toFixed(2)} €`}
            icon="currency-eur"
            color={COLORS.success}
          />
        )}
      </View>

      <Button
        mode="contained"
        icon="file-pdf-box"
        onPress={handleExportPDF}
        style={styles.exportButton}
        disabled={entries.length === 0}
      >
        Exporter en PDF
      </Button>
    </ScrollView>
  );
}

function StatCard({ label, value, color }: {
  label: string;
  value: string;
  icon: string;
  color: string;
}) {
  return (
    <Card style={styles.statCard}>
      <Card.Content style={styles.statContent}>
        <Text variant="bodySmall" style={styles.statLabel}>{label}</Text>
        <Text variant="headlineSmall" style={[styles.statValue, { color }]}>
          {value}
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 16,
    color: COLORS.primary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  statCard: {
    width: '47%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  statLabel: {
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontWeight: 'bold',
  },
  exportButton: {
    marginTop: 24,
    paddingVertical: 4,
  },
});
