import { registerRootComponent } from 'expo';
import App from './src/App'; // Chemin relatif correct

// Enveloppez App avec des Providers si nécessaire (Navigation, Redux, etc.)
console.log('✅ Index.js loaded'); // Debug

registerRootComponent(App);