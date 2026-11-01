import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Calendar, Wallet, Bookmark, CheckCircle } from 'lucide-react-native';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' }}
            style={styles.avatar}
          />
          <View style={{ flex: 1, marginLeft: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={styles.name}>Priya Nair</Text>
              <CheckCircle size={14} color="#2D5A46" />
            </View>
            <Text style={styles.username}>@priya_nair • Kochi</Text>
            <View style={styles.statsRow}>
              <Text style={styles.stat}><strong>18</strong> Looks</Text>
              <Text style={styles.stat}><strong>2.4k</strong> Followers</Text>
            </View>
          </View>
        </View>

        {/* Section Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Consultations</Text>
          <View style={styles.bookingCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.bookingStatus}>Confirmed</Text>
              <Text style={styles.bookingDate}>Nov 12 • 2:00 PM</Text>
            </View>
            <Text style={styles.serviceTitle}>Complete Virtual Wardrobe Audit</Text>
            <Text style={styles.stylistName}>With Rohan Varma (Kozhikode)</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Collections</Text>
          <View style={styles.savedCard}>
            <Bookmark size={18} color="#D4AF37" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.savedTitle}>Old Money Wardrobe Staples</Text>
              <Text style={styles.savedSubtitle}>14 saved looks</Text>
            </View>
          </View>
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAE8E3',
    marginBottom: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#B8B1A5',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#191919',
  },
  username: {
    fontSize: 12,
    color: '#8A8176',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  stat: {
    fontSize: 12,
    color: '#191919',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#191919',
    marginBottom: 10,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAE8E3',
  },
  bookingStatus: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2D5A46',
    textTransform: 'uppercase',
  },
  bookingDate: {
    fontSize: 11,
    color: '#8A8176',
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#191919',
    marginTop: 6,
  },
  stylistName: {
    fontSize: 12,
    color: '#5E564E',
    marginTop: 2,
  },
  savedCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAE8E3',
    flexDirection: 'row',
    alignItems: 'center',
  },
  savedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#191919',
  },
  savedSubtitle: {
    fontSize: 11,
    color: '#8A8176',
    marginTop: 2,
  },
});
