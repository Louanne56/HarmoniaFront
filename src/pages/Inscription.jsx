import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import {inscrireUtilisateur} from '../services/apiService'; // Importation de la fonction d'inscription

const Inscription = ({ navigation }) => {
  // Définition des états locaux pour les champs du formulaire
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState('');
  const [loading, setLoading] = useState(false); // Pour gérer l'état de chargement

  // Fonction de gestion de l'inscription
  const handleInscription = async () => {
    // Validation (identique à votre version actuelle)
    if (!pseudo || !email || !motDePasse || !confirmationMotDePasse) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
  
    if (motDePasse !== confirmationMotDePasse) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }
  
    if (motDePasse.length < 4) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 4 caractères');
      return;
    }
  
    setLoading(true);
  
    const result = await inscrireUtilisateur({
      pseudo,
      email,
      motDePasse
    });
  
    setLoading(false);
  
    if (result.success) {
      navigation.navigate('Connexion', { 
        newlyRegistered: true,
        email: email,
        message: `Inscription réussie ! Bienvenue ${pseudo}`
      });
    } else {
      Alert.alert(
        'Erreur', 
        result.errors.join('\n\n') || result.message
      );
    }
  };
  return (
    <View style={styles.conteneurPrincipal}>
      <Text style={styles.titre}>Inscription</Text>

      <View style={styles.conteneurFormulaire}>
        {/* Champ pseudo */}
        <TextInput
          style={styles.champ}
          placeholder="Pseudo"
          value={pseudo}
          onChangeText={setPseudo}
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        {/* Champ email */}
        <TextInput
          style={styles.champ}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        
        {/* Champ mot de passe */}
        <TextInput
          style={styles.champ}
          placeholder="Mot de passe (6 caractères min)"
          value={motDePasse}
          onChangeText={setMotDePasse}
          secureTextEntry={true} // Masquer le mot de passe
        />
        
        {/* Champ confirmation mot de passe */}
        <TextInput
          style={styles.champ}
          placeholder="Confirmez le mot de passe"
          value={confirmationMotDePasse}
          onChangeText={setConfirmationMotDePasse}
          secureTextEntry={true} // Masquer le mot de passe
        />

        {/* Affichage d'un loader pendant le chargement */}
        {loading ? (
          <ActivityIndicator size="large" color="#808080" style={styles.loader} />
        ) : (
          // Bouton d'inscription
          <TouchableOpacity 
            style={styles.bouton} 
            onPress={handleInscription}
            disabled={loading} // Désactive le bouton si déjà en chargement
          >
            <Text style={styles.texteBouton}>S'inscrire</Text>
          </TouchableOpacity>
        )}

        {/* Lien vers la page de connexion */}
        <TouchableOpacity 
          style={styles.lienConnexion}
          onPress={() => navigation.navigate('Connexion')}
        >
          <Text style={styles.texteLien}>Déjà un compte ? Connectez-vous</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles pour la page
const styles = StyleSheet.create({
  conteneurPrincipal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  titre: {
    position: 'absolute',
    top: 50,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  conteneurFormulaire: {
    width: '80%',
    padding: 20,
    backgroundColor: '#ffffe0',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10,
  },
  champ: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  bouton: {
    backgroundColor: '#808080',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  texteBouton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lienConnexion: {
    marginTop: 10,
    alignItems: 'center',
  },
  texteLien: {
    color: '#3498db',
    textDecorationLine: 'underline',
  },
});

export default Inscription;
