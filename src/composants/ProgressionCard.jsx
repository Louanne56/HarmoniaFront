import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import BoutonFavoris from './BoutonFavoris';
import { getResourceUrl } from '../services/apiService'; // Fonction pour récupérer l'URL des ressources

// Composant représentant une carte de progression avec favoris et affichage d'accords
const ProgressionCard = ({ progression, isFavorite, onToggleFavorite }) => {
  // États pour gérer la visibilité du modal et l'accord sélectionné
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAccord, setSelectedAccord] = useState(null);

  // Fonction pour afficher l'accord sélectionné dans un modal
  const handleAccordPress = (accord) => {
    setSelectedAccord(accord);
    setModalVisible(true);
  };

  return (
    <View style={styles.progressionCard}>
      {/* Bouton pour marquer comme favori */}
      <BoutonFavoris
        isFavorite={isFavorite}
        onToggle={onToggleFavorite}
        accessibilityLabel={`Marquer ${progression.nom} comme favori`}
      />
      {/* Affichage du nom de la progression */}
      <Text style={styles.progressionName}>{progression.nom}</Text>

      {/* Liste des accords de la progression */}
      {progression.accords.length > 0 && (
        <View style={styles.accordsList}>
          {progression.accords.map((accord, index) => (
            <TouchableOpacity key={index} style={styles.accordBox} onPress={() => handleAccordPress(accord)}>
              <Text style={styles.accordText}>{accord}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Modal avec image de l'accord sélectionné */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedAccord && (
              <Image
                source={{ uri: getResourceUrl(`/images/${selectedAccord}.png`) }} // URL de l'image
                style={styles.accordImage}
                resizeMode="contain"
              />
            )}
            {/* Bouton pour fermer le modal */}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  progressionCard: {   //style pour la carte de progression
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    position: 'relative',
  },
  progressionName: { // Style pour le nom de la progression
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'left',
  },
  accordsList: {  // Style pour la liste des accords (disposition en ligne)
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  accordBox: { // Style pour chaque accord (boîte avec fond coloré)
    backgroundColor: '#d9b3ff',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 45,
    marginBottom: 10,
  },
  accordText: { // Style pour le texte des accords (blanc et centré)
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 14,
  },
  // Styles pour le Modal
  modalContainer: {  // Style pour le fond du modal (fondu noir)
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: { // Style pour le contenu du modal (cadré avec fond blanc)
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  accordImage: { // Style pour l'image de l'accord
    width: 200, 
    height: 200,
  },
  closeButton: { // Style pour le bouton de fermeture du modal
    marginTop: 15,
    backgroundColor: '#d9b3ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: { // Style pour le texte du bouton de fermeture
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProgressionCard;
