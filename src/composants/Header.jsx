import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import des icônes Ionicons
import { useAuth } from '../services/AuthContext'; // Contexte pour la gestion de l'authentification
import { SafeAreaView } from 'react-native-safe-area-context'; // Pour assurer la compatibilité avec l'encoche des appareils

const Header = () => {
  const { logout } = useAuth(); // Récupère la fonction de déconnexion du contexte

  return (
    <SafeAreaView style={styles.safeArea}> {/* Utilise le composant SafeAreaView pour gérer l'affichage sur les écrans*/}
      <View style={styles.header}> {/* Conteneur principal du header */}
        <Text style={styles.title}></Text> 
        <TouchableOpacity onPress={logout} style={styles.logoutButton}> {/* Bouton de déconnexion */}
          <Ionicons name="log-out-outline" size={24} color="#333" /> {/* Icône de déconnexion */}
          <Text style={styles.logoutText}>Déconnexion</Text> {/* Texte à côté de l'icône */}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#f5f5f5' }, // Couleur de fond du SafeAreaView
  header: { 
    height: 60, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 15, 
    backgroundColor: '#f5f5f5', 
    borderBottomWidth: 1, 
    borderBottomColor: '#e0e0e0' 
  }, // Style pour le conteneur du header, avec une barre de séparation en bas
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' }, // Style du titre (même s'il est vide ici)
  logoutButton: { flexDirection: 'row', alignItems: 'center' }, // Bouton avec icône et texte alignés horizontalement
  logoutText: { marginLeft: 5, color: '#333' }, // Espacement à gauche du texte de déconnexion
});

export default Header;
