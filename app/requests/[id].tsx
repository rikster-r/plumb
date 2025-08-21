import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeistText } from '@/components/GeistText';
import { useLocalSearchParams, router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { requests } from '@/lib/data';

const RequestDetailsPage = () => {
  const { id } = useLocalSearchParams();
  const [request, setRequest] = useState(
    () => requests.find((req) => req.id === Number(id))!
  );
  const [newNote, setNewNote] = useState(request.note || '');
  const [isEditingNote, setIsEditingNote] = useState(false);

  const statusConfig: Record<
    string,
    {
      color: string;
      backgroundColor: string;
      borderColor: string;
      icon: keyof typeof Ionicons.glyphMap;
    }
  > = {
    новая: {
      color: '#1F5EDB',
      backgroundColor: '#F0F5FF',
      borderColor: '#D0E0FF',
      icon: 'alert-circle-outline',
    },
    'в пути': {
      color: '#B47D00',
      backgroundColor: '#FFF8E6',
      borderColor: '#FFECB3',
      icon: 'car-outline',
    },
    'в работе': {
      color: '#0A7E5E',
      backgroundColor: '#ECFDF5',
      borderColor: '#A7F3D0',
      icon: 'construct-outline',
    },
    завершена: {
      color: '#4B5563',
      backgroundColor: '#F9FAFB',
      borderColor: '#D1D5DB',
      icon: 'checkmark-circle-outline',
    },
  };

  const statusFlow = {
    новая: 'в пути',
    'в пути': 'в работе',
    'в работе': 'завершена',
    завершена: null,
  };

  const nextStatusLabels = {
    новая: 'Выехать',
    'в пути': 'Начать работу',
    'в работе': 'Завершить',
    завершена: null,
  };

  const priorityColors = {
    высокий: '#C21818',
    средний: '#B47D00',
    низкий: '#0A7E5E',
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const handleStatusChange = () => {
    const nextStatus = statusFlow[request.status as keyof typeof statusFlow];
    if (nextStatus) {
      setRequest((prev) => ({ ...prev, status: nextStatus }));
    }
  };

  const handleAddFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        setRequest((prev) => ({
          ...prev,
          files: [
            ...prev.files,
            {
              id: Date.now().toString(),
              name: file.name,
              uri: file.uri,
              type: file.mimeType || 'unknown',
              size: file.size || 0,
            },
          ],
        }));
        Alert.alert('Файл добавлен', `Файл "${file.name}" успешно добавлен`);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось добавить файл');
    }
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      setRequest((prev) => ({ ...prev, note: newNote.trim() }));
      setIsEditingNote(false);
    }
  };

  const statusStyle = statusConfig[request.status as keyof typeof statusConfig];
  const { date, time } = formatDateTime(request.createdAt);
  const nextStatus = statusFlow[request.status as keyof typeof statusFlow];
  const nextStatusLabel =
    nextStatusLabels[request.status as keyof typeof nextStatusLabels];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#09090B" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <GeistText weight={700} style={styles.headerTitle}>
            Заявка #{id}
          </GeistText>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusStyle.backgroundColor,
                borderColor: statusStyle.borderColor,
              },
            ]}
          >
            <Ionicons
              name={statusStyle.icon}
              size={14}
              color={statusStyle.color}
            />
            <GeistText
              weight={500}
              style={[styles.statusText, { color: statusStyle.color }]}
            >
              {request.status.slice(0, 1).toUpperCase() +
                request.status.slice(1)}
            </GeistText>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Applicant Info */}
        <View style={styles.section}>
          <GeistText weight={600} style={styles.sectionTitle}>
            Заявитель
          </GeistText>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color="#52525B" />
              <GeistText weight={500} style={styles.infoText}>
                {request.applicant.name}
              </GeistText>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color="#52525B" />
              <GeistText weight={400} style={styles.infoText}>
                {request.applicant.phone}
              </GeistText>
            </View>
          </View>
        </View>

        {/* Client Info */}
        <View style={styles.section}>
          <GeistText weight={600} style={styles.sectionTitle}>
            Клиент
          </GeistText>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color="#52525B" />
              <GeistText weight={500} style={styles.infoText}>
                {request.client.name}
              </GeistText>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color="#52525B" />
              <GeistText weight={400} style={styles.infoText}>
                {request.client.phone}
              </GeistText>
            </View>
          </View>
        </View>

        {/* Address */}
        <View style={styles.section}>
          <GeistText weight={600} style={styles.sectionTitle}>
            Адрес
          </GeistText>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color="#52525B" />
              <GeistText weight={400} style={styles.infoText}>
                {request.address.house}
                {request.address.apartmentNumber &&
                  `, кв. ${request.address.apartmentNumber}`}
              </GeistText>
            </View>
            {(request.address.entranceNumber ||
              request.address.floorNumber) && (
              <View style={styles.infoRow}>
                <Ionicons name="business-outline" size={20} color="#52525B" />
                <GeistText weight={400} style={styles.infoText}>
                  {request.address.entranceNumber &&
                    `Подъезд ${request.address.entranceNumber}`}
                  {request.address.entranceNumber &&
                    request.address.floorNumber &&
                    ', '}
                  {request.address.floorNumber &&
                    `этаж ${request.address.floorNumber}`}
                </GeistText>
              </View>
            )}
            {request.address.intercomCode && (
              <View style={styles.infoRow}>
                <Ionicons name="keypad-outline" size={20} color="#52525B" />
                <GeistText weight={400} style={styles.infoText}>
                  Код домофона: {request.address.intercomCode}
                </GeistText>
              </View>
            )}
          </View>
        </View>

        {/* Problem Details */}
        <View style={styles.section}>
          <GeistText weight={600} style={styles.sectionTitle}>
            Описание проблемы
          </GeistText>
          <View style={styles.card}>
            <View>
              <View style={styles.infoRow}>
                <Ionicons name="construct-outline" size={20} color="#52525B" />
                <GeistText weight={500} style={styles.infoText}>
                  {request.category}
                </GeistText>
                <View
                  style={[
                    styles.priorityBadge,
                    {
                      backgroundColor: `${priorityColors[request.priority as keyof typeof priorityColors]}15`,
                      borderColor: `${priorityColors[request.priority as keyof typeof priorityColors]}30`,
                    },
                  ]}
                >
                  <GeistText
                    weight={500}
                    style={[
                      styles.priorityText,
                      {
                        color:
                          priorityColors[
                            request.priority as keyof typeof priorityColors
                          ],
                      },
                    ]}
                  >
                    {request.priority.slice(0, 1).toUpperCase() +
                      request.priority.slice(1)}
                  </GeistText>
                </View>
                
              </View>
              <GeistText
                weight={400}
                style={[styles.problemDescription, { marginTop: 12 }]}
              >
                {request.problem.description}
              </GeistText>
              {request.problem.applicantWords && (
                <View style={styles.applicantWordsContainer}>
                  <GeistText weight={500} style={styles.applicantWordsLabel}>
                    Со слов заявителя:
                  </GeistText>
                  <GeistText weight={400} style={styles.applicantWordsText}>
                    {request.problem.applicantWords}
                  </GeistText>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Request Info */}
        <View style={styles.section}>
          <GeistText weight={600} style={styles.sectionTitle}>
            Таймлайн
          </GeistText>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={20} color="#52525B" />
              <GeistText weight={400} style={styles.infoText}>
                Создана: {date} в {time}
              </GeistText>
            </View>
            {request.departureAt && (
              <View style={styles.infoRow}>
                <Ionicons name="car-outline" size={20} color="#52525B" />
                <GeistText weight={400} style={styles.infoText}>
                  Выезд: {formatDateTime(request.departureAt).date} в{' '}
                  {formatDateTime(request.departureAt).time}
                </GeistText>
              </View>
            )}
            {request.arrivalAt && (
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={20} color="#52525B" />
                <GeistText weight={400} style={styles.infoText}>
                  Прибытие: {formatDateTime(request.arrivalAt).date} в{' '}
                  {formatDateTime(request.arrivalAt).time}
                </GeistText>
              </View>
            )}
            {request.completedAt && (
              <View style={styles.infoRow}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color="#52525B"
                />
                <GeistText weight={400} style={styles.infoText}>
                  Завершена: {formatDateTime(request.completedAt).date} в{' '}
                  {formatDateTime(request.completedAt).time}
                </GeistText>
              </View>
            )}
          </View>
        </View>

        {/* Files Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <GeistText weight={600} style={styles.sectionTitle}>
              Фото ({request.files.length})
            </GeistText>
            <TouchableOpacity onPress={handleAddFile} style={styles.addButton}>
              <Ionicons name="add" size={20} color="#1F5EDB" />
              <GeistText weight={500} style={styles.addButtonText}>
                Добавить
              </GeistText>
            </TouchableOpacity>
          </View>
          {request.files.length > 0 ? (
            <View style={styles.card}>
              {request.files.map((file, index) => (
                <View
                  key={file.id}
                  style={[styles.fileRow, index > 0 && styles.fileRowBorder]}
                >
                  <Ionicons name="document-outline" size={20} color="#52525B" />
                  <View style={styles.fileInfo}>
                    <GeistText weight={500} style={styles.fileName}>
                      {file.name}
                    </GeistText>
                    <GeistText weight={400} style={styles.fileSize}>
                      {(file.size / 1024 / 1024).toFixed(2)} МБ
                    </GeistText>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Ionicons name="document-outline" size={32} color="#A1A1AA" />
              <GeistText weight={400} style={styles.emptyText}>
                Фото не добавлены
              </GeistText>
            </View>
          )}
        </View>

        {/* Notes Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <GeistText weight={600} style={styles.sectionTitle}>
              Примечание
            </GeistText>
            <TouchableOpacity
              onPress={() => setIsEditingNote(!isEditingNote)}
              style={styles.addButton}
            >
              <Ionicons
                name={request.note ? 'create-outline' : 'add'}
                size={20}
                color="#1F5EDB"
              />
              <GeistText weight={500} style={styles.addButtonText}>
                {request.note ? 'Изменить' : 'Добавить'}
              </GeistText>
            </TouchableOpacity>
          </View>

          {isEditingNote ? (
            <View style={styles.addNoteCard}>
              <TextInput
                style={styles.noteInput}
                placeholder="Введите примечание..."
                value={newNote}
                onChangeText={setNewNote}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              <View style={styles.noteActions}>
                <TouchableOpacity
                  onPress={() => {
                    setIsEditingNote(false);
                    setNewNote(request.note || '');
                  }}
                  style={styles.cancelButton}
                >
                  <GeistText weight={500} style={styles.cancelButtonText}>
                    Отмена
                  </GeistText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAddNote}
                  style={styles.saveButton}
                >
                  <GeistText weight={500} style={styles.saveButtonText}>
                    Сохранить
                  </GeistText>
                </TouchableOpacity>
              </View>
            </View>
          ) : request.note ? (
            <View style={styles.card}>
              <GeistText weight={400} style={styles.noteText}>
                {request.note}
              </GeistText>
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Ionicons
                name="document-text-outline"
                size={32}
                color="#A1A1AA"
              />
              <GeistText weight={400} style={styles.emptyText}>
                Примечание не добавлено
              </GeistText>
            </View>
          )}
        </View>

        {/* Works Done Section */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Action Button */}
      {nextStatus && (
        <View style={styles.bottomAction}>
          <TouchableOpacity
            onPress={handleStatusChange}
            style={styles.actionButton}
          >
            <GeistText weight={600} style={styles.actionButtonText}>
              {nextStatusLabel}
            </GeistText>
            <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFD',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EAECF0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    color: '#09090B',
    lineHeight: 32,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  statusText: {
    fontSize: 13,
  },
  content: {
    flex: 1,
  },
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 15,
    color: '#27272A',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 4,
  },
  paidText: {
    fontSize: 12,
    color: '#0A7E5E',
  },
  repeatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FFF8E6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFECB3',
    gap: 4,
  },
  repeatText: {
    fontSize: 12,
    color: '#B47D00',
  },
  applicantWordsContainer: {
    marginTop: 12,
    marginLeft: 32,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#D1D5DB',
  },
  applicantWordsLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  applicantWordsText: {},
  priorityText: {
    fontSize: 12,
  },
  problemDescription: {
    fontSize: 15,
    color: '#27272A',
    lineHeight: 22,
    marginTop: 8,
    marginLeft: 32,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  fileRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
    marginTop: 8,
    paddingTop: 16,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 15,
    color: '#27272A',
  },
  fileSize: {
    fontSize: 13,
    color: '#71717A',
    marginTop: 2,
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
    minHeight: 80,
    textAlignVertical: 'top',
    fontFamily: 'Geist-Regular',
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
  noteRow: {
    paddingVertical: 12,
  },
  noteRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
    marginTop: 12,
    paddingTop: 16,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteAuthor: {
    fontSize: 14,
    color: '#09090B',
  },
  noteTime: {
    fontSize: 12,
    color: '#71717A',
  },
  noteText: {
    fontSize: 15,
    color: '#27272A',
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 120,
  },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#EAECF0',
  },
  actionButton: {
    backgroundColor: '#1F5EDB',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default RequestDetailsPage;
