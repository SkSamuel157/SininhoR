import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Pusher from 'pusher-js/react-native';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';

// Configuração das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const pusher = new Pusher('dd78661dc83711748d87', {
  cluster: 'us2',
});

const SininhoR = () => {
  const [notificacoes, setNotificacoes] = useState([]);

  useEffect(() => {
    const getNotificationPermission = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          console.warn('Permissão de notificação não concedida!');
        } else {
          console.log('Permissão de notificação concedida!');
        }
      } else {
        console.log('Permissão já concedida!');
      }
    };

    getNotificationPermission();

    const channel = pusher.subscribe('my-channel');
    channel.bind('my-event', (data) => {
      const newNotification = {
        id: Date.now().toString(),
        title: data.title || 'Sem título',
        message: data.message || 'Sem mensagem',
      };

      setNotificacoes((prevNotificacoes) => [...prevNotificacoes, newNotification]);

      Notifications.scheduleNotificationAsync({
        content: {
          title: newNotification.title,
          body: newNotification.message,
          sound: true,
        },
        trigger: null,
      });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const handleDeleteNotification = async (id) => {
    try {
      await fetch(`http://10.0.2.2:5000/notifications/${id}`, {
        method: 'DELETE',
      });

      setNotificacoes((prev) => prev.filter((notificacao) => notificacao.id !== id));
    } catch (error) {
      console.error('Erro ao excluir a notificação:', error);
    }
  };

  const renderRightActions = (id) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleDeleteNotification(id)}
    >
      <Text style={styles.deleteButtonText}>Apagar</Text>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={24} onPress={() => {/* Função de navegação para voltar */}} />
          <Text style={styles.title}>Notificações</Text>
        </View>
        
        <FlatList
          data={notificacoes}
          renderItem={({ item }) => (
            <Swipeable renderRightActions={() => renderRightActions(item.id)}>
              <View style={styles.notificationContainer}>
                <View style={styles.notificationTextContainer}>
                  <Text style={styles.notificationTitle}>{item.title}</Text>
                  <Text style={styles.notificationMessage}>{item.message}</Text>
                </View>
                <TouchableOpacity style={styles.arrowButton}>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </Swipeable>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  notificationTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
  },
  arrowButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '100%',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SininhoR;
