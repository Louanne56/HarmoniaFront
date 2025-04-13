import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import DropdownSelector from '../composants/DropdownSelector'; // Composant pour la sélection dans un menu déroulant
import ProgressionCard from '../composants/ProgressionCard'; // Composant pour afficher chaque progression d'accords
import { getProgressions } from '../services/apiService'; // Service pour récupérer les progressions depuis l'API
import { useAuth } from "../services/AuthContext"; // Contexte pour récupérer l'utilisateur et le token d'authentification
import { useFavorites } from '../services/FavoritesContext'; // Contexte pour la gestion des favoris

// Données pour les options de tonalité, mode, et style dans les menus déroulants
const notesData = [
  { value: 'C', label: 'Do' }, { value: 'Csharp', label: 'Do#' },
  { value: 'D', label: 'Ré' }, { value: 'Dsharp', label: 'Ré#' },
  { value: 'E', label: 'Mi' }, { value: 'F', label: 'Fa' },
  { value: 'Fsharp', label: 'Fa#' }, { value: 'G', label: 'Sol' },
  { value: 'Gsharp', label: 'Sol#' }, { value: 'A', label: 'La' },
  { value: 'Asharp', label: 'La#' }, { value: 'B', label: 'Si' }
];

const modeData = [
  { value: 'Majeur', label: 'Majeur' }, { value: 'Mineur', label: 'Mineur' }
];

const styleData = [
  { value: null, label: 'Tous styles' },
  { value: 'Jazz', label: 'Jazz' },
  { value: 'Rock', label: 'Rock' }, { value: 'Pop', label: 'Pop' }
];

const Home = () => {
  // Accès aux données de l'utilisateur et au token depuis le contexte
  const { user, token } = useAuth();
  // Accès aux favoris et fonction de gestion des favoris via le contexte
  const { favoriteIds, toggleFavorite } = useFavorites();
  
  // États locaux pour gérer les sélections et les données des progressions
  const [note, setNote] = useState(null); // Tonalité sélectionnée
  const [mode, setMode] = useState(null); // Mode sélectionné
  const [style, setStyle] = useState(null); // Style musical sélectionné
  const [progressions, setProgressions] = useState([]); // Liste des progressions d'accords récupérées
  const [loading, setLoading] = useState(false); // État de chargement
  const [error, setError] = useState(null); // État d'erreur
  
  const userId = user?.id; // Récupérer l'ID de l'utilisateur (si disponible)

  // Fonction pour récupérer les progressions d'accords via l'API
  const fetchProgressions = async () => {
    // Vérification que la tonalité et le mode ont été sélectionnés
    if (!note || !mode) {
      Alert.alert('Sélection incomplète', 'Veuillez sélectionner une tonalité et un mode.');
      return;
    }

    // Mise à jour de l'état de chargement et réinitialisation des erreurs
    setLoading(true);
    setError(null);
    
    try {
      // Requête à l'API pour récupérer les progressions d'accords
      const data = await getProgressions(note, mode, style);
      setProgressions(data); // Mise à jour des progressions
    } catch (err) {
      setError(`Impossible de charger les progressions: ${err.message}`); // Gestion des erreurs
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* Section des menus déroulants pour sélectionner tonalité, mode et style */}
      <View style={styles.dropdownsContainer}>
        <DropdownSelector data={notesData} selectedValue={note} onSelect={e => setNote(e.value)} placeholder="Tonalité" />
        <DropdownSelector data={modeData} selectedValue={mode} onSelect={e => setMode(e.value)} placeholder="Mode" />
        <DropdownSelector data={styleData} selectedValue={style} onSelect={e => setStyle(e.value)} placeholder="Style" />
      </View>

      {/* Bouton pour lancer la recherche des progressions */}
      <TouchableOpacity style={styles.button} onPress={fetchProgressions}>
        <Text style={styles.buttonText}>Trouver des progressions</Text>
      </TouchableOpacity>

      {/* Affichage du loader pendant le chargement */}
      {loading && <ActivityIndicator size="large" color="#3498db" />}
      
      {/* Affichage d'un message d'erreur si une erreur se produit */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Affichage des progressions sous forme de cartes */}
      <View style={styles.resultsContainer}>
        {progressions.map(progression => (
          <ProgressionCard
            key={progression.id} // Utilisation de l'ID unique de chaque progression
            progression={progression}
            isFavorite={favoriteIds.includes(progression.id)} // Vérification si la progression est un favori
            onToggleFavorite={() => toggleFavorite(progression)} // Fonction pour ajouter/retirer des favoris
          />
        ))}
      </View>
    </View>
  );
};

export default Home;

// Styles pour la page
const styles = StyleSheet.create({
  mainContainer: { padding: 16, flex: 1 },
  dropdownsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  button: { backgroundColor: '#808080', padding: 12, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: 'white', fontSize: 16 },
  resultsContainer: { marginTop: 20 },
  errorText: { color: 'red', textAlign: 'center' }
});
