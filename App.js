import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Pusher from 'pusher-js/react-native';

const pusher = new Pusher('dd78661dc83711748d87', {
  cluster: 'us2'
});

const SininhoR = () => {
  const [notificacoes, setNotificacoes] = useState([]);

  useEffect(() => {
    const channel = pusher.subscribe('my-channel');
    channel.bind('my-event', (data) => {
      setNotificacoes((prevNotificacoes) => [
        ...prevNotificacoes,
        { title: data.title || 'Sem título', message: data.message || 'Sem mensagem' },
      ]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificações Recebidas:</Text>
      <FlatList
        data={notificacoes}
        renderItem={({ item }) => (
          <View style={styles.notificationContainer}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text>{item.message}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  notificationContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  notificationTitle: {
    fontWeight: 'bold',
  },
});

export default SininhoR;
