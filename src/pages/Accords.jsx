import React from 'react';
import { View } from 'react-native'; // Composant de base pour la mise en page
import Diagram from '../composants/Diagram'; // Composant Diagram qui représente un diagramme d'accords

// Composant principal de la page Accords
export default function Accords() {
  return (
    // View est utilisé ici pour contenir le diagramme avec flex: 1 pour occuper toute la hauteur de l'écran
    <View style={{ flex: 1 }}>
      <Diagram /> {/* Affiche le composant Diagram */}
    </View>
  );
}
