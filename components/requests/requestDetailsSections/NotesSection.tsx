import React, { useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { GeistText } from '@/components/GeistText';

interface NotesSectionProps {
  note: string;
  onNoteChange: (text: string) => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({ note, onNoteChange }) => {
  const textInputRef = useRef<TextInput>(null);

  return (
    <View style={styles.section}>
      <GeistText weight={600} style={styles.sectionTitle}>
        Примечание
      </GeistText>
      <View style={styles.noteCard}>
        <TextInput
          ref={textInputRef}
          style={styles.noteInput}
          placeholder="Введите примечание..."
          value={note}
          onChangeText={onNoteChange}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#09090B',
    marginBottom: 12,
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    padding: 16,
    minHeight: 100,
  },
  noteInput: {
    fontSize: 15,
    color: '#27272A',
    lineHeight: 22,
    textAlignVertical: 'top',
    fontFamily: 'Geist-Regular',
    paddingVertical: 4,
  },
});

export default NotesSection;
