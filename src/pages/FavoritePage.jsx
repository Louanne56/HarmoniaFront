import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from "../services/AuthContext"; // Contexte pour récupérer les informations de l'utilisateur
import ProgressionCard from '../composants/ProgressionCard'; // Composant pour afficher chaque progression d'accords
import { toggleFavoriteAPI, getUserFavorites } from '../services/apiService'; // Services API pour gérer les favoris
import AsyncStorage from '@react-native-async-storage/async-storage'; // Pour accéder au stockage local
import { useFocusEffect } from '@react-navigation/native'; // Hook pour exécuter du code lors du focus sur la page
import { useCallback } from 'react';

// Page des favoris
const FavoritePage = () => {
  const [favorites, setFavorites] = useState([]); // Liste des favoris de l'utilisateur
  const [loading, setLoading] = useState(true); // État de chargement
  const [error, setError] = useState(null); // État d'erreur lors de la récupération des favoris
  const { user } = useAuth(); // Accès aux informations de l'utilisateur depuis le contexte
  const userId = user?.id; // ID de l'utilisateur

  // Récupère les favoris lorsque l'utilisateur arrive sur la page
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchFavorites(); // Appel à la fonction pour récupérer les favoris
      }
    }, [userId])
  );

  // Fonction pour récupérer les favoris depuis l'API
  const fetchFavorites = async () => {
    try {
      setLoading(true); // Début du chargement
      const data = await getUserFavorites(userId); // Appel API pour récupérer les favoris de l'utilisateur
      setFavorites(data); // Mise à jour des favoris
      setLoading(false); // Fin du chargement
    } catch (err) {
      console.error("Erreur attrapée dans fetchFavorites:", err);
      setError("Impossible de charger vos favoris. Veuillez réessayer plus tard."); // Gestion des erreurs
      setLoading(false);
    }
  };

  // Fonction pour ajouter ou retirer une progression des favoris
  const toggleFavorite = async (progression) => {
    try {
      const token = await AsyncStorage.getItem('token'); // Récupération du token utilisateur depuis le stockage
      const progressionId = progression.progressionAccords.id; // ID de la progression d'accords
      
      // Appel API pour ajouter ou retirer des favoris
      await toggleFavoriteAPI(userId, progressionId, token, true);

      // Mise à jour de la liste des favoris après modification
      setFavorites(prevFavorites => prevFavorites.filter(fav => fav.progressionAccords.id !== progressionId));

      // Affichage d'un message de succès
      Alert.alert("Succès", "Progression retirée des favoris");
    } catch (err) {
      console.error("Erreur lors de la suppression du favori:", err);
      Alert.alert("Erreur", "Impossible de retirer des favoris. Veuillez réessayer."); // Message d'erreur
    }
  };

  // Fonction pour vérifier que la progression est valide avant de l'afficher
  const isValidProgression = (progression) => {
    return progression &&
           progression.progressionAccords &&
           progression.progressionAccords.accords &&
           Array.isArray(progression.progressionAccords.accords) &&
           progression.progressionAccords.accords.length > 0;
  };

  // Fonction pour rendre chaque élément de la liste (progression favorite)
  const renderItem = ({ item }) => {
    if (!isValidProgression(item)) {
      return null; // Ignore les progressions invalides
    }
  
    return (
      <ProgressionCard
        progression={item.progressionAccords} // Détails de la progression
        isFavorite={true} // Indique que la progression est un favori
        onToggleFavorite={() => toggleFavorite(item)} // Fonction pour ajouter/retirer des favoris
      />
    );
  };

  // Fonction pour extraire la clé unique de chaque item dans la liste
  const keyExtractor = (item) => {
    return item?.progressionAccords?.id?.toString() || Math.random().toString();
  };

  // Affichage lorsque la page est en cours de chargement
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Chargement de vos favoris...</Text>
      </View>
    );
  }

  // Affichage en cas d'erreur lors du chargement des favoris
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Affichage si l'utilisateur n'a pas encore de favoris
  if (favorites.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.noFavoritesText}>Vous n'avez pas encore de favoris</Text>
        <Text style={styles.noFavoritesSubText}>
          Trouvez des progressions d'accords qui vous plaisent et ajoutez-les à vos favoris
        </Text>
      </View>
    );
  }

  // Affichage des favoris sous forme de liste
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Vos Progressions Favorites</Text>
      <FlatList
        data={favorites} // Liste des favoris à afficher
        renderItem={renderItem} // Fonction de rendu pour chaque élément
        keyExtractor={keyExtractor} // Fonction pour extraire la clé unique
        contentContainerStyle={styles.listContainer} // Style pour le conteneur de la liste
        showsVerticalScrollIndicator={false} // Désactive l'indicateur de défilement
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    color: '#d8000c',
    fontSize: 16,
    textAlign: 'center',
  },
  noFavoritesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
  },
  noFavoritesSubText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    paddingHorizontal: 30,
  }
});

export default FavoritePage;
