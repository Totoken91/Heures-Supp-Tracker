# Plan d'attaque — Heures Supp Tracker

## Stack technique
- **React Native + Expo SDK 55** (TypeScript)
- **Expo Router** — navigation par fichiers (tabs)
- **expo-sqlite** — base de donnees locale
- **Zustand** — state management
- **React Native Paper** — composants UI Material Design
- **expo-print + expo-sharing** — generation et partage PDF
- **react-native-chart-kit** — graphiques

---

## Phase 1 : Fondations (FAIT)
- [x] Init projet Expo + TypeScript
- [x] Installation des dependances
- [x] Structure des dossiers (`app/`, `src/`)
- [x] Types TypeScript (`OvertimeEntry`, `Settings`, `MonthlyStats`)
- [x] Constantes (couleurs, taux de majoration, mois FR)
- [x] Couche base de donnees SQLite (schema, CRUD)
- [x] Store Zustand (state global)
- [x] Fonctions utilitaires (calcul heures, majorations, montants)
- [x] Generation PDF (template HTML, export + partage)
- [x] Layout principal + navigation par tabs
- [x] 4 ecrans : Saisie, Historique, Stats, Reglages

## Phase 2 : Amelioration UX
- [ ] Date picker natif (remplacer le champ texte)
- [ ] Time picker natif (remplacer les champs texte)
- [ ] Edition d'une entree existante (tap sur une entree dans l'historique)
- [ ] Confirmation visuelle animee apres saisie
- [ ] Pull-to-refresh sur l'historique
- [ ] Recherche / filtre dans l'historique

## Phase 3 : Statistiques avancees
- [ ] Graphique en barres : heures supp par semaine
- [ ] Graphique lineaire : evolution sur les 6 derniers mois
- [ ] Camembert : repartition 25% / 50%
- [ ] Comparaison mois en cours vs mois precedent
- [ ] Calcul hebdomadaire reel (regrouper par semaine ISO)

## Phase 4 : Export et partage
- [ ] Ameliorer le template PDF (mise en page pro)
- [ ] Export CSV
- [ ] Export vers Google Sheets (optionnel)
- [ ] Partage par email direct

## Phase 5 : Personnalisation
- [ ] Theme sombre
- [ ] Choix de la devise (EUR, CHF, etc.)
- [ ] Convention collective personnalisable (taux de majoration)
- [ ] Rappel / notification quotidienne pour saisir ses heures
- [ ] Gestion multi-profils (si plusieurs employeurs)

## Phase 6 : Production
- [ ] Icone et splash screen personnalises
- [ ] Build EAS (Android APK / iOS)
- [ ] Tests unitaires (calculs de majorations)
- [ ] Publication Play Store / App Store

---

## Architecture des fichiers

```
Heures-Supp-Tracker/
  app/
    _layout.tsx          # Layout racine (PaperProvider)
    (tabs)/
      _layout.tsx        # Navigation par tabs (4 onglets)
      index.tsx          # Saisie des heures
      history.tsx        # Historique mensuel
      stats.tsx          # Statistiques + export PDF
      settings.tsx       # Reglages utilisateur
  src/
    types/index.ts       # Types TypeScript
    constants/index.ts   # Constantes (couleurs, taux, mois)
    database/index.ts    # Couche SQLite (CRUD)
    store/index.ts       # Store Zustand
    utils/
      overtime.ts        # Calculs heures et majorations
      pdf.ts             # Generation PDF
    components/          # Composants reutilisables (a venir)
```

---

## Notes
- Base de donnees 100% locale (pas de backend)
- Majorations par defaut : 25% de 35h a 43h, 50% au-dela (droit francais)
- Les seuils sont personnalisables dans les reglages
