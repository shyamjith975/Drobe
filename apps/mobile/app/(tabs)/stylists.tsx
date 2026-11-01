import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { Star, MapPin, CheckCircle, Calendar } from 'lucide-react-native';

export default function StylistsScreen() {
  const [stylists, setStylists] = useState([
    {
      id: '1',
      display_name: 'Rohan Varma',
      category: 'Celebrity & Wedding Stylist',
      base_city: 'Kozhikode',
      rating: 4.9,
      starting_price: 2500,
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      bio: 'Bespoke tailoring, linen cuts, and Old Money aesthetic for weddings and editorial.'
    },
    {
      id: '2',
      display_name: 'Maya Nambiar',
      category: 'Bridal & Occasion Stylist',
      base_city: 'Kochi',
      rating: 5.0,
      starting_price: 3000,
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      bio: 'Bridal Kasavu modernization and temple jewelry coordination.'
    }
  ]);

  const renderStylist = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={styles.name}>{item.display_name}</Text>
            <CheckCircle size={14} color="#2D5A46" />
          </View>
          <Text style={styles.category}>{item.category}</Text>
          <View style={styles.metaRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Star size={12} color="#D4AF37" fill="#D4AF37" />
              <Text style={styles.rating}>{item.rating}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
              <MapPin size={12} color="#8A8176" />
              <Text style={styles.city}>{item.base_city}</Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.bio}>{item.bio}</Text>

      <View style={styles.footer}>
        <View>
          <Text style={styles.fromLabel}>Starts at</Text>
          <Text style={styles.price}>₹{item.starting_price.toLocaleString('en-IN')}</Text>
        </View>
        <TouchableOpacity style={styles.bookButton}>
          <Calendar size={14} color="#F7F5F0" />
          <Text style={styles.bookButtonText}>Book Stylist</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={stylists}
        keyExtractor={(item) => item.id}
        renderItem={renderStylist}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5F0',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EAE8E3',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#191919',
  },
  category: {
    fontSize: 12,
    color: '#B85D43',
    fontWeight: '600',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    fontSize: 12,
    fontWeight: '700',
    color: '#191919',
    marginLeft: 3,
  },
  city: {
    fontSize: 12,
    color: '#8A8176',
    marginLeft: 3,
  },
  bio: {
    fontSize: 12,
    color: '#5E564E',
    lineHeight: 16,
    marginTop: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EAE8E3',
  },
  fromLabel: {
    fontSize: 10,
    color: '#8A8176',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#191919',
  },
  bookButton: {
    backgroundColor: '#191919',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bookButtonText: {
    color: '#F7F5F0',
    fontSize: 12,
    fontWeight: '600',
  },
});
