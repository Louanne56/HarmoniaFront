import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useAuth } from "../services/AuthContext"; // Contexte pour gérer l'authentification
import { api } from "../services/apiService"; // Service API pour faire des requêtes

// Composant de connexion
const Connexion = ({ navigation }) => {
  const [pseudo, setPseudo] = useState(""); // État pour le pseudo
  const [motDePasse, setMotDePasse] = useState(""); // État pour le mot de passe
  const [loading, setLoading] = useState(false); // État pour gérer le chargement
  const { login } = useAuth(); // Fonction pour gérer la connexion de l'utilisateur
  const [errorMessage, setErrorMessage] = useState(''); // État pour afficher un message d'erreur

  // Fonction pour gérer la connexion de l'utilisateur
  const handleConnexion = async () => {
    // Vérifie que le pseudo et le mot de passe sont remplis
    if (!pseudo || !motDePasse) {
      Alert.alert("Erreur", "Veuillez entrer un pseudo et un mot de passe");
      return;
    }
  
    setLoading(true); // Début du chargement
  
    try {
      // Envoi des données de connexion à l'API
      const response = await api.post("/auth/connexion", {
        pseudo,
        motDePasse,
      });
  
      // Enregistrement des données de l'utilisateur après une connexion réussie
      await login({
        user: response.data.utilisateur,
        token: response.data.token,
        refreshToken: response.data.refreshToken,
      });
  
      // Affichage d'une alerte de succès et redirection vers la page principale
      Alert.alert("Connexion réussie", `Bienvenue ${response.data.utilisateur.pseudo} !`);
      navigation.navigate("MainTabs");
    } catch (error) {
      // Gestion des erreurs selon le code de statut de la réponse
      const status = error.response?.status;
      const message = error.response?.data?.message;
  
      if (status === 401) {
        // Erreur pour mot de passe incorrect ou pseudo introuvable
        if (message?.toLowerCase().includes("mot de passe")) {
          Alert.alert("Mot de passe incorrect", "Le mot de passe saisi est invalide.");
        } else if (message?.toLowerCase().includes("pseudo")) {
          Alert.alert("Pseudo introuvable", "Aucun compte trouvé avec ce pseudo.");
        } else {
          Alert.alert("Identifiants incorrects", message || "Pseudo ou mot de passe incorrect.");
        }
      } else if (status === 400) {
        Alert.alert("Erreur de validation", message || "Vérifiez les informations saisies.");
      } else {
        Alert.alert("Erreur de connexion", message || "Problème de connexion au serveur.");
      }
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  return (
    <View style={styles.conteneurPrincipal}>
      <View style={styles.conteneurFormulaire}>
        {/* Champ pour entrer le pseudo */}
        <TextInput
          style={styles.champ}
          placeholder="Entrez votre pseudo"
          value={pseudo}
          onChangeText={setPseudo}
          autoCapitalize="none"
          editable={!loading} // Désactive le champ pendant le chargement
        />
        
        {/* Champ pour entrer le mot de passe */}
        <TextInput
          style={styles.champ}
          placeholder="Entrez votre mot de passe"
          value={motDePasse}
          onChangeText={setMotDePasse}
          secureTextEntry={true} // Masque le mot de passe
          editable={!loading} // Désactive le champ pendant le chargement
        />
        
        {/* Bouton de connexion avec gestion du chargement */}
        <TouchableOpacity 
          style={[styles.bouton, loading && styles.boutonDesactive]} 
          onPress={handleConnexion}
          disabled={loading} // Désactive le bouton pendant le chargement
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" /> // Affiche un indicateur de chargement pendant la connexion
          ) : (
            <Text style={styles.texteBouton}>Se connecter</Text>
          )}
        </TouchableOpacity>
        
        {/* Bouton pour naviguer vers la page d'inscription */}
        <TouchableOpacity 
          style={styles.bouton} 
          onPress={() => navigation.navigate("Inscription")}
          disabled={loading} // Désactive le bouton pendant le chargement
        >
          <Text style={styles.texteBouton}>Inscris-toi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  conteneurPrincipal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5", // Couleur de fond de la page
  },
  titre: {
    position: "absolute",
    top: 50,
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  conteneurFormulaire: {
    width: "80%", // Largeur du formulaire
    padding: 20,
    backgroundColor: "#ffffe0", // Couleur de fond du formulaire
    borderWidth: 2,
    borderColor: "#000", // Bordure noire du formulaire
    borderRadius: 10, // Bords arrondis
  },
  champ: {
    height: 40,
    borderColor: "#ccc", // Couleur de bordure du champ de texte
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff", // Couleur de fond des champs de texte
  },
  bouton: {
    backgroundColor: "#808080", // Couleur de fond du bouton
    borderWidth: 1,
    borderColor: "#000", // Bordure noire du bouton
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    alignItems: "center",
  },
  boutonDesactive: {
    backgroundColor: "#cccccc", // Couleur du bouton lorsqu'il est désactivé
    borderColor: "#999999", // Couleur de bordure du bouton désactivé
  },
  texteBouton: {
    color: "#fff", // Couleur du texte du bouton
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Connexion;
