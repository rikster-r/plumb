import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeistText } from '@/components/GeistText';

interface NotesSectionProps {
  note?: string;
  isEditing: boolean;
  newNote: string;
  onEditPress: () => void;
  onNoteChange: (text: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({
  note,
  isEditing,
  newNote,
  onEditPress,
  onNoteChange,
  onSave,
  onCancel,
}) => {
  const textInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (isEditing && textInputRef.current) {
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 200);
    }
  }, [isEditing]);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <GeistText weight={600} style={styles.sectionTitle}>
          Примечание
        </GeistText>
        <TouchableOpacity onPress={onEditPress} style={styles.addButton}>
          <Ionicons
            name={note ? 'create-outline' : 'add'}
            size={20}
            color="#1F5EDB"
          />
          <GeistText weight={500} style={styles.addButtonText}>
            {note ? 'Изменить' : 'Добавить'}
          </GeistText>
        </TouchableOpacity>
      </View>

      {isEditing ? (
        <View style={styles.addNoteCard}>
          <TextInput
            ref={textInputRef}
            style={styles.noteInput}
            placeholder="Введите примечание..."
            value={newNote}
            onChangeText={onNoteChange}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <View style={styles.noteActions}>
            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <GeistText weight={500} style={styles.cancelButtonText}>
                Отмена
              </GeistText>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSave} style={styles.saveButton}>
              <GeistText weight={500} style={styles.saveButtonText}>
                Сохранить
              </GeistText>
            </TouchableOpacity>
          </View>
        </View>
      ) : note ? (
        <View style={styles.card}>
          <GeistText weight={400} style={styles.noteText}>
            {note}
          </GeistText>
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Ionicons name="document-text-outline" size={32} color="#A1A1AA" />
          <GeistText weight={400} style={styles.emptyText}>
            Примечание не добавлено
          </GeistText>
        </View>
      )}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F0F5FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D0E0FF',
  },
  addButtonText: {
    fontSize: 14,
    color: '#1F5EDB',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    padding: 16,
    gap: 16,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#A1A1AA',
  },
  addNoteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    padding: 18,
    marginBottom: 12,
  },
  noteInput: {
    fontSize: 15,
    color: '#27272A',
    lineHeight: 22,
    minHeight: 100,
    textAlignVertical: 'top',
    fontFamily: 'Geist-Regular',
    paddingVertical: 8,
  },
  noteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#71717A',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1F5EDB',
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  noteText: {
    fontSize: 15,
    color: '#27272A',
    lineHeight: 22,
  },
});

export default NotesSection;
