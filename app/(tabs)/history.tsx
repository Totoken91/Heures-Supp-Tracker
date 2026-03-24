import { useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Card, IconButton, Chip, ActivityIndicator } from 'react-native-paper';
import { useFocusEffect } from 'expo-router';
import { useAppStore } from '../../src/store';
import { formatHours } from '../../src/utils/overtime';
import { COLORS, MONTHS_FR } from '../../src/constants';
import { OvertimeEntry } from '../../src/types';

export default function HistoryScreen() {
  const entries = useAppStore((s) => s.entries);
  const currentMonth = useAppStore((s) => s.currentMonth);
  const setCurrentMonth = useAppStore((s) => s.setCurrentMonth);
  const deleteEntry = useAppStore((s) => s.deleteEntry);
  const loadEntries = useAppStore((s) => s.loadEntries);
  const isLoading = useAppStore((s) => s.isLoading);

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [currentMonth])
  );

  const [year, month] = currentMonth.split('-').map(Number);
  const monthLabel = `${MONTHS_FR[month - 1]} ${year}`;

  const goToPrevMonth = () => {
    const d = new Date(year, month - 2, 1);
    setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

  const goToNextMonth = () => {
    const d = new Date(year, month, 1);
    setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Supprimer',
      'Voulez-vous vraiment supprimer cette entrée ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => deleteEntry(id) },
      ]
    );
  };

  const totalMonth = entries.reduce((sum, e) => sum + e.total_hours, 0);

  const renderEntry = ({ item }: { item: OvertimeEntry }) => (
    <Card style={styles.entryCard}>
      <Card.Content style={styles.entryContent}>
        <View style={styles.entryInfo}>
          <Text variant="titleSmall">
            {new Date(item.date).toLocaleDateString('fr-FR', {
              weekday: 'short', day: 'numeric', month: 'short',
            })}
          </Text>
          <Text variant="bodyMedium" style={styles.entryTime}>
            {item.start_time} → {item.end_time}
          </Text>
          {item.note ? (
            <Text variant="bodySmall" style={styles.entryNote}>{item.note}</Text>
          ) : null}
        </View>
        <View style={styles.entryRight}>
          <Chip compact textStyle={styles.chipText}>{formatHours(item.total_hours)}</Chip>
          <IconButton
            icon="delete-outline"
            size={20}
            iconColor={COLORS.error}
            onPress={() => handleDelete(item.id)}
          />
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.monthNav}>
        <IconButton icon="chevron-left" onPress={goToPrevMonth} />
        <Text variant="titleMedium" style={styles.monthLabel}>{monthLabel}</Text>
        <IconButton icon="chevron-right" onPress={goToNextMonth} />
      </View>

      <View style={styles.totalBar}>
        <Text variant="bodyLarge" style={styles.totalText}>
          Total : {formatHours(totalMonth)} — {entries.length} entrée{entries.length > 1 ? 's' : ''}
        </Text>
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} />
      ) : entries.length === 0 ? (
        <View style={styles.empty}>
          <Text variant="bodyLarge" style={styles.emptyText}>
            Aucune heure supp ce mois-ci
          </Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderEntry}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: COLORS.surface,
  },
  monthLabel: {
    fontWeight: 'bold',
    minWidth: 150,
    textAlign: 'center',
  },
  totalBar: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    alignItems: 'center',
  },
  totalText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  list: {
    padding: 12,
    gap: 8,
  },
  entryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    marginBottom: 8,
  },
  entryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryInfo: {
    flex: 1,
  },
  entryTime: {
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  entryNote: {
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  entryRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipText: {
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 40,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    color: COLORS.textSecondary,
  },
});
