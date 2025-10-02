import React from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeistText } from '@/components/GeistText';

const { width: screenWidth } = Dimensions.get('window');

type Props = {
  visible: boolean;
  user: User | undefined;
  onClose: () => void;
  onLogout: () => void;
};

export const UserPopover: React.FC<Props> = ({
  visible,
  user,
  onClose,
  onLogout,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.popover}>
              <View style={styles.popoverHeader}>
                <View style={styles.userAvatar}>
                  <Ionicons name="person" size={24} color="#52525B" />
                </View>
                <GeistText weight={600} style={styles.popoverTitle}>
                  Профиль
                </GeistText>
              </View>

              <View style={styles.popoverContent}>
                <View style={styles.userInfoItem}>
                  <GeistText weight={500} style={styles.userInfoLabel}>
                    {user?.role === "Служебный транспорт" ? "Транспорт" : "ФИО"}
                  </GeistText>
                  <GeistText weight={400} style={styles.userInfoValue}>
                    {user?.name || 'Не указано'}
                  </GeistText>
                </View>

                <View style={styles.userInfoItem}>
                  <GeistText weight={500} style={styles.userInfoLabel}>
                    Email
                  </GeistText>
                  <GeistText weight={400} style={styles.userInfoValue}>
                    {user?.email || 'Не указан'}
                  </GeistText>
                </View>

                <View style={styles.userInfoItem}>
                  <GeistText weight={500} style={styles.userInfoLabel}>
                    Телефон
                  </GeistText>
                  <GeistText weight={400} style={styles.userInfoValue}>
                    {user?.phone ?? 'Не указан'}
                  </GeistText>
                </View>

                <View style={styles.dividerPopover} />

                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={onLogout}
                >
                  <Ionicons name="log-out-outline" size={20} color="#C21818" />
                  <GeistText weight={500} style={styles.logoutText}>
                    Выйти из аккаунта
                  </GeistText>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 70,
    paddingRight: 10,
  },
  popover: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    minWidth: 280,
    maxWidth: screenWidth - 48,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  popoverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  popoverTitle: {
    fontSize: 18,
    color: '#09090B',
    lineHeight: 24,
  },
  popoverContent: {
    padding: 20,
  },
  userInfoItem: {
    marginBottom: 16,
  },
  userInfoLabel: {
    fontSize: 13,
    color: '#71717A',
    lineHeight: 18,
    marginBottom: 4,
  },
  userInfoValue: {
    fontSize: 15,
    color: '#18181B',
    lineHeight: 22,
  },
  dividerPopover: {
    height: 1,
    backgroundColor: '#F1F1F1',
    marginVertical: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    marginTop: 8,
  },
  logoutText: {
    fontSize: 15,
    color: '#C21818',
    marginLeft: 8,
    lineHeight: 22,
  },
});
