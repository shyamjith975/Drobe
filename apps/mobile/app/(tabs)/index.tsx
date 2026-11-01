import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { Heart, MessageCircle, Bookmark, Tag, MapPin } from 'lucide-react-native';

export default function FeedScreen() {
  const [posts, setPosts] = useState([
    {
      id: '1',
      author: {
        display_name: 'Rohan Varma',
        username: 'rohan_varma_style',
        role: 'Celebrity Stylist',
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
      },
      caption: 'The effortless Riviera formula: Unstructured linen shirt, stone chinos, and Belgian suede loafers. 🌿✨',
      media_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      category: 'Old Money',
      city: 'Kozhikode',
      likes_count: 142,
      comments_count: 18,
      product_tags: [
        { title: 'Riviera Camp Shirt', brand: 'Maison Ivory', price: 4200 }
      ]
    },
    {
      id: '2',
      author: {
        display_name: 'Maya Nambiar',
        username: 'maya_couture',
        role: 'Bridal Stylist',
        avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
      },
      caption: 'Kerala Kasavu modernized with contemporary tailored jackets for a destination backwaters ceremony. 🤍',
      media_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      category: 'Wedding & Occasion',
      city: 'Kochi',
      likes_count: 215,
      comments_count: 26,
      product_tags: []
    }
  ]);

  const renderPost = ({ item }: { item: any }) => (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: item.author.avatar_url }} style={styles.avatar} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.authorName}>{item.author.display_name}</Text>
          <View style={styles.authorMeta}>
            <Text style={styles.roleBadge}>{item.author.role}</Text>
            <Text style={styles.cityText}>• {item.city}</Text>
          </View>
        </View>
      </View>

      {/* Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.media_url }} style={styles.image} resizeMode="cover" />
        {item.product_tags.length > 0 && (
          <View style={styles.shopBadge}>
            <Tag size={12} color="#191919" />
            <Text style={styles.shopBadgeText}>Shop Look ({item.product_tags.length})</Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Heart size={20} color="#191919" />
            <Text style={styles.actionText}>{item.likes_count}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MessageCircle size={20} color="#191919" />
            <Text style={styles.actionText}>{item.comments_count}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Bookmark size={20} color="#191919" />
        </TouchableOpacity>
      </View>

      {/* Caption */}
      <View style={styles.captionContainer}>
        <Text style={styles.captionText}>
          <Text style={{ fontWeight: '700' }}>{item.author.display_name} </Text>
          {item.caption}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={{ paddingVertical: 12 }}
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
    marginBottom: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EAE8E3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#B8B1A5',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#191919',
  },
  authorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  roleBadge: {
    fontSize: 10,
    color: '#B85D43',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  cityText: {
    fontSize: 11,
    color: '#8A8176',
    marginLeft: 4,
  },
  imageContainer: {
    width: '100%',
    height: 400,
    position: 'relative',
    backgroundColor: '#191919',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  shopBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  shopBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#191919',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  leftActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#191919',
  },
  captionContainer: {
    paddingHorizontal: 12,
    paddingBottom: 14,
  },
  captionText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#191919',
  },
});
