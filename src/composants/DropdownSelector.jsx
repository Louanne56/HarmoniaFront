import React from 'react';
import { Dropdown } from 'react-native-element-dropdown'; // Composant de sélection générique
import { StyleSheet } from 'react-native';

// Composant de sélection pour les tonalités, modes et styles
const DropdownSelector = ({ data, selectedValue, onSelect, placeholder }) => (
  <Dropdown
    style={styles.dropdown} // Style pour le champ de sélection
    selectedTextStyle={styles.selectedTextStyle} // Style du texte sélectionné
    placeholderStyle={styles.placeholderStyle} // Style du texte du placeholder
    maxHeight={200} // Limite de la hauteur du dropdown
    value={selectedValue} // Valeur actuellement sélectionnée
    data={data} // Liste des options à afficher
    valueField="value" // Champ de la valeur sélectionnée
    labelField="label" // Champ du label affiché
    placeholder={placeholder} // Texte du placeholder
    onChange={onSelect} // Fonction appelée lorsqu'une option est sélectionnée
  />
);

// Styles pour le dropdown et le texte
const styles = StyleSheet.create({
  dropdown: { height: 50, width: 100, backgroundColor: '#ffffb3', borderWidth: 1, borderRadius: 8, paddingHorizontal: 8 },
  placeholderStyle: { fontSize: 16 },
  selectedTextStyle: { fontSize: 16, marginLeft: 8 },
});

export default DropdownSelector;
