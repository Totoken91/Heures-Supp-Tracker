import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Card, Divider } from 'react-native-paper';
import { useAppStore } from '../../src/store';
import { COLORS } from '../../src/constants';
import { Settings as SettingsType } from '../../src/types';

export default function SettingsScreen() {
  const settings = useAppStore((s) => s.settings);
  const saveSettings = useAppStore((s) => s.saveSettings);

  const [form, setForm] = useState<SettingsType>(settings);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const updateField = (key: keyof SettingsType, value: string) => {
    if (['weeklyLegalHours', 'rate25Threshold', 'rate50Threshold', 'hourlyRate'].includes(key)) {
      setForm({ ...form, [key]: value === '' ? 0 : parseFloat(value) || 0 });
    } else {
      setForm({ ...form, [key]: value });
    }
  };

  const handleSave = async () => {
    if (form.rate25Threshold >= form.rate50Threshold) {
      Alert.alert('Erreur', 'Le seuil 25% doit être inférieur au seuil 50%');
      return;
    }
    await saveSettings(form);
    Alert.alert('Succès', 'Réglages sauvegardés');
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Informations personnelles
          </Text>

          <TextInput
            label="Nom de l'employé"
            value={form.employeeName}
            onChangeText={(v) => updateField('employeeName', v)}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Nom de l'entreprise"
            value={form.companyName}
            onChangeText={(v) => updateField('companyName', v)}
            mode="outlined"
            style={styles.input}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Paramètres de calcul
          </Text>

          <TextInput
            label="Heures légales / semaine"
            value={String(form.weeklyLegalHours)}
            onChangeText={(v) => updateField('weeklyLegalHours', v)}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            label="Seuil majoration 25% (heures)"
            value={String(form.rate25Threshold)}
            onChangeText={(v) => updateField('rate25Threshold', v)}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            label="Seuil majoration 50% (heures)"
            value={String(form.rate50Threshold)}
            onChangeText={(v) => updateField('rate50Threshold', v)}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />

          <Divider style={styles.divider} />

          <TextInput
            label="Taux horaire brut (€)"
            value={form.hourlyRate > 0 ? String(form.hourlyRate) : ''}
            onChangeText={(v) => updateField('hourlyRate', v)}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            placeholder="Optionnel — pour estimer le montant"
          />

          <Text variant="bodySmall" style={styles.hint}>
            Si renseigné, le montant brut estimé sera affiché dans les stats et le PDF.
          </Text>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.saveButton}
        icon="content-save"
      >
        Sauvegarder
      </Button>
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
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 12,
  },
  divider: {
    marginVertical: 12,
  },
  hint: {
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: -4,
  },
  saveButton: {
    marginBottom: 40,
    paddingVertical: 4,
  },
});
