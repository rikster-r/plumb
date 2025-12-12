import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeistText } from '@/components/GeistText';
import { UserPopover } from './UserPopover';
import { useUser } from '@/context/currentUser';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showUserButton?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showUserButton = true,
}) => {
  const { user, logout } = useUser();
  const [showUserPopover, setShowUserPopover] = React.useState(false);

  const handleLogout = async () => {
    setShowUserPopover(false);
    await logout();
  };

  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <GeistText weight={700} style={styles.mainTitle}>
              {title}
            </GeistText>
            {subtitle && (
              <GeistText weight={400} style={styles.subtitle}>
                {subtitle}
              </GeistText>
            )}
          </View>

          {showUserButton && (
            <TouchableOpacity
              style={styles.userButton}
              onPress={() => {
                setShowUserPopover(true);
              }}
            >
              <Ionicons
                name="person-circle-outline"
                size={32}
                color="#52525B"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <UserPopover
        visible={showUserPopover}
        user={user}
        onClose={() => setShowUserPopover(false)}
        onLogout={handleLogout}
      />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EAECF0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 24,
    color: '#09090B',
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 15,
    color: '#52525B',
    marginTop: 4,
  },
  userButton: {
    padding: 4,
    borderRadius: 20,
  },
});
