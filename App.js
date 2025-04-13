import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './src/services/AuthContext';
import { FavoritesProvider } from './src/services/FavoritesContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import des pages et composants
import Connexion from './src/pages/Connexion';
import Inscription from './src/pages/Inscription';
import Home from './src/pages/Home';
import Accords from './src/pages/Accords';
import FavoritePage from './src/pages/FavoritePage';
import Header from './src/composants/Header'; // Composant d'en-tête personnalisé
// Création des navigateurs
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();

// Écran de chargement, affiché pendant la vérification de l'état de connexion
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#6200ee" />
  </View>
);

// TabNavigator : gestion de la navigation par onglets pour les pages principales (Home, Accords, Favoris)
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Accords') {
            iconName = focused ? 'musical-notes' : 'musical-notes-outline';
          } else if (route.name === 'Favoris') {
            iconName = focused ? 'heart' : 'heart-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // Pas d'en-tête sur les écrans du TabNavigator
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Accords" component={Accords} />
      <Tab.Screen name="Favoris" component={FavoritePage} />
    </Tab.Navigator>
  );
};

// AuthStackNavigator : gestion de la navigation pour l'authentification (Connexion, Inscription)
const AuthStackNavigator = () => (
  <AuthStack.Navigator initialRouteName="Connexion">
    <AuthStack.Screen 
      name="Connexion" 
      component={Connexion} 
      options={{ headerShown: true }}
    />
    <AuthStack.Screen 
      name="Inscription" 
      component={Inscription} 
      options={{ headerShown: true }}
    />
  </AuthStack.Navigator>
);

// NavigationManager : vérifie si l'utilisateur est connecté et affiche la navigation appropriée
const NavigationManager = () => {
  const { isLoggedIn, loading, token, refreshUserToken } = useAuth();
  
  useEffect(() => {
    const checkTokenAndRefresh = async () => {
      if (token) {
        await refreshUserToken(); // Rafraîchit le token si disponible
      }
    };
    checkTokenAndRefresh();
  }, []); // Effect exécuté une fois au chargement initial

  if (loading) {
    return <LoadingScreen />; // Afficher l'écran de chargement pendant la vérification
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        // Si l'utilisateur est connecté, afficher les pages principales
        <Stack.Navigator>
          <Stack.Screen 
            name="MainTabs" 
            component={TabNavigator} 
            options={{ headerShown: true, header: () => <Header/> }} // Header personnalisé
          />
        </Stack.Navigator>
      ) : (
        // Si l'utilisateur n'est pas connecté, afficher les pages de connexion
        <AuthStackNavigator />
      )}
    </NavigationContainer>
  );
};

// App : composant principal qui englobe l'ensemble des providers et le gestionnaire de navigation
const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <FavoritesProvider>
          <NavigationManager /> // Gestion de la navigation selon l'état de connexion
        </FavoritesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Fond de l'écran de chargement
  },
});

export default App;
