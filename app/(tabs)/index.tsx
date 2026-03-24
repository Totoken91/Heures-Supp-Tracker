import { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { Button, TextInput, Text, Card, Snackbar } from 'react-native-paper';
import { useAppStore } from '../../src/store';
import { calculateHours, formatHours } from '../../src/utils/overtime';
import { COLORS } from '../../src/constants';

export default function SaisieScreen() {
  const addEntry = useAppStore((s) => s.addEntry);

  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [note, setNote] = useState('');
  const [snackVisible, setSnackVisible] = useState(false);

  const isValidTime = (t: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(t);

  const totalHours = isValidTime(startTime) && isValidTime(endTime)
    ? calculateHours(startTime, endTime)
    : 0;

  const isValidDate = (d: string) => /^\d{4}-\d{2}-\d{2}$/.test(d);

  const handleSubmit = async () => {
    if (!isValidDate(date)) {
      Alert.alert('Erreur', 'Format de date invalide (AAAA-MM-JJ)');
      return;
    }
    if (!isValidTime(startTime) || !isValidTime(endTime)) {
      Alert.alert('Erreur', 'Format d\'heure invalide (HH:MM)');
      return;
    }
    if (totalHours <= 0) {
      Alert.alert('Erreur', 'La durée doit être supérieure à 0');
      return;
    }

    await addEntry({
      date,
      start_time: startTime,
      end_time: endTime,
      total_hours: totalHours,
      note,
    });

    // Reset
    setStartTime('');
    setEndTime('');
    setNote('');
    setSnackVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Enregistrer des heures supplémentaires
          </Text>

          <TextInput
            label="Date (AAAA-MM-JJ)"
            value={date}
            onChangeText={setDate}
            mode="outlined"
            style={styles.input}
            placeholder="2025-01-15"
          />

          <View style={styles.row}>
            <TextInput
              label="Début (HH:MM)"
              value={startTime}
              onChangeText={setStartTime}
              mode="outlined"
              style={[styles.input, styles.halfInput]}
              placeholder="17:00"
              keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
            />
            <TextInput
              label="Fin (HH:MM)"
              value={endTime}
              onChangeText={setEndTime}
              mode="outlined"
              style={[styles.input, styles.halfInput]}
              placeholder="19:30"
              keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
            />
          </View>

          {totalHours > 0 && (
            <View style={styles.preview}>
              <Text variant="bodyLarge" style={styles.previewText}>
                Durée : {formatHours(totalHours)}
              </Text>
            </View>
          )}

          <TextInput
            label="Note (optionnel)"
            value={note}
            onChangeText={setNote}
            mode="outlined"
            style={styles.input}
            placeholder="Ex: Projet urgent client X"
            multiline
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}
            icon="check"
          >
            Enregistrer
          </Button>
        </Card.Content>
      </Card>

      <Snackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        duration={2000}
        style={styles.snackbar}
      >
        Heures supplémentaires enregistrées !
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
  },
  sectionTitle: {
    marginBottom: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  preview: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  previewText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 8,
    paddingVertical: 4,
  },
  snackbar: {
    backgroundColor: COLORS.success,
  },
});
