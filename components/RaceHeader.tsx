import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemeName, useTheme } from '../context/ThemeContext';

const UK_FLAG_URL = 'https://flagcdn.com/w40/gb.png';
const IE_FLAG_URL = 'https://flagcdn.com/w40/ie.png';

type FilterType = 'time' | 'handicap' | 'meeting';

interface RaceHeaderProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const filterOptions: { key: FilterType; label: string }[] = [
  { key: 'time', label: 'Time' },
  { key: 'meeting', label: 'Meeting' },
  { key: 'handicap', label: 'Handicap' },
];

const themeOptions: { name: ThemeName; color: string }[] = [
  { name: 'dark', color: '#121212' },
  { name: 'light', color: '#f0f0f0' },
  { name: 'green', color: '#4CAF50' },
  { name: 'red', color: '#F44336' },
  { name: 'blue', color: '#2196F3' },
];

export default function RaceHeader({ activeFilter, onFilterChange }: RaceHeaderProps) {
  const { theme, themeName, setTheme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.controlsContainer}>
        <View style={[styles.filterContainer, { backgroundColor: theme.headerFilter }]}>
          {filterOptions.map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.radio,
                activeFilter === key && [styles.radioActive, { backgroundColor: theme.headerFilterActive }],
              ]}
              onPress={() => onFilterChange(key)}
            >
              <Text
                style={[
                  styles.radioText,
                  { color: theme.headerFilterText },
                  activeFilter === key && [styles.radioTextActive, { color: theme.headerFilterTextActive }],
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.themeSelectorContainer}>
          {themeOptions.map(({ name, color }) => (
            <TouchableOpacity
              key={name}
              style={[
                styles.themeDot,
                { backgroundColor: color },
                themeName === name && styles.themeDotActive,
              ]}
              onPress={() => setTheme(name)}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    // color is now from theme
  },
  flag: {
    width: 25,
    height: 15,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  filterContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 2,
  },
  radio: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  radioActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  radioText: {
    fontSize: 14,
    fontWeight: '500',
  },
  radioTextActive: {
    // color is now from theme
  },
  themeSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  themeDotActive: {
    borderColor: '#007AFF', // A neutral highlight color
    borderWidth: 2,
  },
});
