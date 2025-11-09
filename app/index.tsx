import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

// In Expo/React Native, you can import JSON files directly.
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

// Group races by place and sort them by time
const groupedAndSortedRaces = (races: Race[]): Record<string, Race[]> => {
  // Group by place
  const grouped = races.reduce((acc, race) => {
    const place = race.place;
    if (!acc[place]) {
      acc[place] = [];
    }
    acc[place].push(race);
    return acc;
  }, {} as Record<string, Race[]>);

  // Sort races within each group by time
  for (const place in grouped) {
    grouped[place].sort((a, b) => a.time.localeCompare(b.time));
  }

  return grouped;
};

export default function Index() {
  const [races, setRaces] = useState<Race[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRaces = async () => {
      try {
        const response = await fetch('https://www.pluckier.co.uk/todays.json');
        if (!response.ok) {
          // If response is not OK (e.g., 404, 500), throw an error to trigger the fallback.
          throw new Error('Network response was not ok.');
        }
        const remoteData = await response.json();
        setRaces(remoteData);
        console.log('Successfully fetched remote race data.');
      } catch (error) {
        console.error('Failed to fetch remote races, falling back to local data:', error);
        // Use the imported local data as a fallback.
        setRaces(localRaceData as Race[]);
      } finally {
        setIsLoading(false);
      }
    };

    void loadRaces();
  }, []);

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  const processedData = groupedAndSortedRaces(races);
  const meetingPlaces = Object.keys(processedData).sort();

  return (
    <ScrollView style={styles.container}>
      {meetingPlaces.map(place => (
        <View key={place} style={styles.meetingContainer}>
          <Text style={styles.meetingTitle}>{place}</Text>
          {processedData[place].map(race => (
            <View key={`${race.place}-${race.time}`} style={styles.raceContainer}>
              <View style={styles.raceHeader}>
                <Text style={styles.raceTime}>{race.time}</Text>
                <Text style={styles.raceTime}>{race.place}</Text>
                <Text style={styles.raceDetailsText}>{race.detail}</Text>
                <Text style={styles.raceSubHeader}>Runners: {race.runners}, Going: {race.going}</Text>
              </View>
              {race.horses.map(horse => (
                <View key={horse.name} style={styles.horseContainer}>
                  <Text style={styles.colNumber}>{horse.number}.</Text>
                  {horse.draw ? (
                    <Text style={styles.colDraw}>({horse.draw})</Text>
                  ) : (
                    <View />
                  )}
                  <Image source={{ uri: horse.silks }} style={styles.colSilks} contentFit="contain" />
                  <Text style={styles.colForm} numberOfLines={1}>{horse.form}</Text>
                  <Text style={styles.colName} numberOfLines={1}>{horse.name}</Text>
                  <Text style={styles.colWeight}>{horse.weight}</Text>
                  <Text style={styles.colAge}>{horse.age}</Text>
                  <Text style={styles.colLastRun}>{horse.lastRun}d</Text>
                  <Text style={styles.colTrainer} numberOfLines={1}>{horse.trainer}</Text>
                  <Text style={styles.colJockey} numberOfLines={1}>{horse.jockey}</Text>
                </View>
              ))}
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
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  meetingContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  meetingTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  raceContainer: {
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
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
  raceSubHeader: {
    fontSize: 14,
    color: '#666',
  },
  raceDetailsText: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  horseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  colNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    width: '2%',
  },
  colDraw: {
    fontSize: 14,
    fontWeight: 'bold',
    width: '3%',
  },
  colSilks: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
  colForm: {
    width: '4%',
    textAlign: 'right',
    fontSize: 12,
    color: '#555',
    marginRight: 4,
    marginLeft: 7,
  },
  colName: {
    width: '12%',
    fontSize: 16,
    fontWeight: '500',
    //flex: 1, // Allow name to take up the most space
    marginRight: 5,
  },
  colWeight: {
    width: '8%',
    fontSize: 14,
    textAlign: 'center',
  },
  colAge: {
    width: '2%',
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
  },
  colLastRun: {
    width: '6%',
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
  },
  colTrainer: {
    width: '15%',
    fontSize: 12,
    textAlign: 'left',
    color: '#555',
    marginRight: 5,
  },
  colJockey: {
    width: '12%',
    fontSize: 12,
    textAlign: 'left',
    color: '#555',
  },
});
