import { Image } from 'expo-image';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import RaceHeader from '../components/RaceHeader';
import { useTheme } from '../context/ThemeContext';

// In Expo/React Native, you can import JSON files directly.
import localOddsData from '../data/odds.json';
import localRaceData from '../data/todays.json';
// --- Define Types for our Data ---
interface Horse {
  name: string;
  number: string;
  draw: string;
  silks: string;
  form: string;
  trainer: string;
  jockey: string;
  odds: string;
  age: string;
  weight: string;
  lastRun: string;
  // ... other horse properties if they exist
}

interface Race {
  place: string;
  time: string;
  detail: string;
  runners: number;
  going: string;
  horses: Horse[];
  // ... other race properties if they exist
}

// --- Data Processing ---

type FilterType = 'time' | 'handicap' | 'meeting';

const getFilteredAndSortedRaces = (races: Race[], filter: FilterType): Race[] => {
  let processedRaces = [...races];

  // Apply filter
  if (filter === 'handicap') {
    processedRaces = processedRaces.filter(race =>
      race.detail.toLowerCase().includes('handicap')
    );
  }

  // Apply sorting based on the filter
  if (filter === 'meeting') {
    // Sort by place name first, then by time
    processedRaces.sort((a, b) => {
      if (a.place < b.place) return -1;
      if (a.place > b.place) return 1;
      return a.time.localeCompare(b.time); // If places are same, sort by time
    });
  } else {
    // Default sort for 'time' and 'handicap' is by time only
    processedRaces.sort((a, b) => a.time.localeCompare(b.time));
  }

  return processedRaces;
};

const mergeOddsIntoRaces = (races: Race[], oddsData: { name: string; odds?: number | string }[]): Race[] => {
  if (!races || !oddsData) {
    return races;
  }

  // Create a map of horse names (lowercase) to their odds for efficient lookup.
  const oddsMap = new Map<string, number | string>();
  for (const odd of oddsData) {
    if (odd.name) {
      // If odds are missing or null, it's a non-runner (NR).
      const oddsValue = odd.odds !== undefined && odd.odds !== null ? odd.odds : 'NR';
      oddsMap.set(odd.name.toLowerCase(), oddsValue);
    }
  }

  // Iterate over each race and horse to update the odds.
  return races.map(race => ({
    ...race,
    horses: race.horses.map(horse => {
      const horseNameLower = horse.name.toLowerCase();
      // Find odds, also checking for names without apostrophes.
      const horseOdds = oddsMap.get(horseNameLower) ?? oddsMap.get(horseNameLower.replace(/'/g, '')) ?? null;
      return { ...horse, odds: horseOdds?.toString() };
    }),
  }));
};

export default function Index() {
  const [races, setRaces] = useState<Race[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('time');
  const navigation = useNavigation();
  const { theme } = useTheme();
  useEffect(() => {
    const loadRaces = async () => {
      try {
        let finalRaces: Race[];
        let finalOdds: { name: string; odds?: number | string }[];

        try {
          // 1. Try to fetch remote races
          const racesResponse = await fetch('https://www.pluckier.co.uk/todays.json');
          if (!racesResponse.ok) throw new Error('Remote races fetch failed.');
          finalRaces = await racesResponse.json();
          console.log('Using remote race data.');
        } catch (e) {
          // 2. If it fails, use local races
          console.log('Using local race data due to error:', e.message);
          finalRaces = localRaceData as Race[];
        }

        try {
          // 3. Try to fetch remote odds
          const oddsResponse = await fetch('https://www.pluckier.co.uk/odds.json');
          if (!oddsResponse.ok) throw new Error('Remote odds fetch failed.');
          finalOdds = await oddsResponse.json();
          console.log('Using remote odds data.');
        } catch (e) {
          // 4. If it fails, use local odds
          console.log('Using local odds data due to error:', e.message);
          finalOdds = localOddsData;
        }

        // 5. Merge them and update state
        const mergedData = mergeOddsIntoRaces(finalRaces, finalOdds);
        setRaces(mergedData);
      } finally {
        setIsLoading(false);
      }
    };

    void loadRaces();
  }, []); // Only run once on mount

  // Set header options and update when theme or filter changes
  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: theme.card },
      headerTitle: () => <RaceHeader activeFilter={filter} onFilterChange={setFilter} />,
    });
  }, [navigation, filter, theme]);

  if (isLoading) {
    return <View style={[styles.centered, { backgroundColor: theme.background }]}><ActivityIndicator size="large" /></View>;
  }

  const processedData = getFilteredAndSortedRaces(races, filter);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {processedData.map(race => (
        <View key={`${race.place}-${race.time}`} style={[styles.meetingContainer, { backgroundColor: theme.card, shadowColor: theme.text }]}>
          <View style={styles.raceHeader}>
            <Text style={[styles.raceTime, { color: theme.text }]}>{race.time}</Text>
            <Text style={[styles.racePlace, { color: theme.text }]}>{race.place}</Text>
            <Text style={[styles.raceDetailsText, { color: theme.subtleText }]}>{race.detail}</Text>
            <Text style={[styles.raceSubHeader, { color: theme.subtleText }]}>Runners: {race.runners}, Going: {race.going}</Text>
          </View>
          {race.horses.map(horse => (
            <View key={horse.name} style={[styles.horseContainer, { borderBottomColor: theme.border }]}>
              <Text style={[styles.colNumber, { color: theme.text }]}>{horse.number}.</Text>
              {horse.draw ? <Text style={[styles.colDraw, { color: theme.subtleText }]}>({horse.draw})</Text> : <View />}
              <Image source={{ uri: horse.silks }} style={styles.colSilks} contentFit="contain" />
              <Text style={[styles.colForm, { color: theme.subtleText }]} numberOfLines={1}>{horse.form}</Text>
              <View style={styles.colNameContainer}>
                <Text style={[styles.colName, { color: theme.text }]} numberOfLines={1}>{horse.name}</Text>
                {horse.odds && <Text style={[styles.colOdds, { color: theme.subtleText }]}>{horse.odds}</Text>}
              </View>
              <Text style={[styles.colWeight, { color: theme.text }]}>{horse.weight}</Text>
              <Text style={[styles.colAge, { color: theme.subtleText }]}>{horse.age}</Text>
              <Text style={[styles.colLastRun, { color: theme.subtleText }]}>{horse.lastRun}d</Text>
              <Text style={[styles.colTrainer, { color: theme.subtleText }]} numberOfLines={1}>{horse.trainer}</Text>
              <Text style={[styles.colJockey, { color: theme.subtleText }]} numberOfLines={1}>{horse.jockey}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  meetingContainer: {
    marginBottom: 20,
    borderRadius: 8,
    padding: 15,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    padding: 10,
  },
  raceHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  raceTime: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  racePlace: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  raceSubHeader: {
    fontSize: 14,
  },
  raceDetailsText: {
    fontSize: 14,
    marginRight: 8,
  },
  horseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  colNumber: {
    width: '3%',
    fontSize: 14,
    fontWeight: 'bold',
  },
  colDraw: {
    width: '3%',
    fontSize: 14,
    fontWeight: 'bold',
  },
  colSilks: {
    width: 24,
    height: 24,
    marginRight: 2,
  },
  colForm: {
    width: '10%',
    textAlign: 'right',
    fontSize: 12,
    marginRight: 7,
    marginLeft: 4,
  },
  colNameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },
  colName: {
    fontSize: 16,
    fontWeight: '500',
  },
  colOdds: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  colWeight: {
    width: '11%',
    fontSize: 14,
    textAlign: 'center',
  },
  colAge: {
    width: '3%',
    fontSize: 14,
    textAlign: 'center',
  },
  colLastRun: {
    width: '8%',
    fontSize: 14,
    textAlign: 'center',
  },
  colTrainer: {
    width: '15%',
    fontSize: 12,
    textAlign: 'left',
    marginRight: 5,
  },
  colJockey: {
    width: '15%',
    fontSize: 12,
    textAlign: 'left',
  },
});
