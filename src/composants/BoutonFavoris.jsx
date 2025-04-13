import React from 'react';
import { TouchableOpacity } from 'react-native'; // Composant pour les boutons interactifs
import Icon from 'react-native-vector-icons/FontAwesome'; // Icone provenant de la bibliothèque FontAwesome
import { StyleSheet } from 'react-native'; // Pour gérer les styles en React Native

// Composant BoutonFavoris
const BoutonFavoris = ({ isFavorite, onToggle }) => (
  // TouchableOpacity permet de rendre l'élément cliquable
  <TouchableOpacity onPress={onToggle} style={styles.heartIconContainer}>
    <Icon
      // L'icône change en fonction de l'état 'isFavorite' : cœur plein ou cœur vide
      name={isFavorite ? 'heart' : 'heart-o'}
      size={20} // Taille de l'icône
      color={isFavorite ? 'red' : 'gray'} // Couleur de l'icône : rouge si favori, gris sinon
    />
  </TouchableOpacity>
);

// Définition des styles pour le conteneur de l'icône
const styles = StyleSheet.create({
  heartIconContainer: {
    position: 'absolute', // Position absolue pour placer l'icône indépendamment des autres éléments
    top: 10, // Distance du haut de l'écran ou du parent
    right: 10, // Distance de la droite de l'écran ou du parent
    zIndex: 1, // Assure que l'icône soit au-dessus d'autres éléments si nécessaire
  },
});

export default BoutonFavoris;
