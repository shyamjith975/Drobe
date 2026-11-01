import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Sparkles, MapPin } from 'lucide-react-native';

export default function DiscoverScreen() {
  const categories = ['Old Money', 'Quiet Luxury', 'Kasavu Modern', 'Streetwear', 'Wedding'];

  const trendingLooks = [
    {
      id: '1',
      title: 'The Riviera Linen Cut',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
      category: 'Old Money',
      city: 'Kozhikode'
    },
    {
      id: '2',
      title: 'Modern Kerala Bridal Kasavu',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      category: 'Wedding',
      city: 'Kochi'
    },
    {
      id: '3',
      title: 'Oversized Monochromatic Fit',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
      category: 'Streetwear',
      city: 'Mumbai'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.heading}>Visual Discovery</Text>
        <Text style={styles.subheading}>Explore trending human-styled aesthetics & lookbooks.</Text>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesRow}>
          {categories.map((c) => (
            <TouchableOpacity key={c} style={styles.pill}>
              <Text style={styles.pillText}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Trending Cards */}
        <View style={styles.grid}>
          {trendingLooks.map((look) => (
            <TouchableOpacity key={look.id} style={styles.card}>
              <Image source={{ uri: look.image }} style={styles.cardImage} />
              <View style={styles.cardOverlay}>
                <Text style={styles.cardCategory}>{look.category}</Text>
                <Text style={styles.cardTitle}>{look.title}</Text>
                <Text style={styles.cardCity}>
                  <MapPin size={10} color="#FFFFFF" /> {look.city}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5F0',
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#191919',
  },
  subheading: {
    fontSize: 12,
    color: '#5E564E',
    marginTop: 2,
    marginBottom: 16,
  },
  categoriesRow: {
    marginBottom: 20,
  },
  pill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE8E3',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#191919',
  },
  grid: {
    gap: 16,
  },
  card: {
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#191919',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    opacity: 0.85,
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(25, 25, 25, 0.55)',
  },
  cardCategory: {
    fontSize: 10,
    color: '#D4AF37',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  cardCity: {
    fontSize: 11,
    color: '#EAE8E3',
    marginTop: 4,
  },
});
