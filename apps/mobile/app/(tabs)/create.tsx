import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView 
} from 'react-native';
import { Upload, Tag } from 'lucide-react-native';

export default function CreateScreen() {
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('Old Money');
  const [city, setCity] = useState('Kochi');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.heading}>Publish Look</Text>
        <Text style={styles.subheading}>Share outfit breakdowns and tag fashion pieces.</Text>

        <View style={styles.uploadBox}>
          <Upload size={32} color="#8A8176" />
          <Text style={styles.uploadText}>Select Photograph or Video</Text>
          <Text style={styles.uploadSubtext}>Up to 25MB • JPEG, PNG, WEBP</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Caption</Text>
          <TextInput
            multiline
            numberOfLines={3}
            placeholder="Describe your outfit, drape, and styling choices..."
            value={caption}
            onChangeText={setCaption}
            style={styles.inputArea}
          />

          <Text style={styles.label}>Category</Text>
          <TextInput
            value={category}
            onChangeText={setCategory}
            style={styles.input}
          />

          <Text style={styles.label}>City / Location</Text>
          <TextInput
            value={city}
            onChangeText={setCity}
            style={styles.input}
          />

          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Publish to Editorial Feed</Text>
          </TouchableOpacity>
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
    marginBottom: 20,
  },
  uploadBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#EAE8E3',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#191919',
    marginTop: 8,
  },
  uploadSubtext: {
    fontSize: 11,
    color: '#8A8176',
    marginTop: 2,
  },
  form: {
    gap: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: '#191919',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#B8B1A5',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
  },
  inputArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#B8B1A5',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#191919',
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 12,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
