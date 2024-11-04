import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import Pusher from 'pusher-js/react-native';

// Credenciais do Pusher para o app "SininhoR"
const pusher = new Pusher('dd78661dc83711748d87', {
  cluster: 'us2'
});

const SininhoR = () => {
  const [notificacoes, setNotificacoes] = useState([]);

  useEffect(() => {
    const channel = pusher.subscribe('my-channel');
    channel.bind('my-event', (data) => {
      console.log('Notificação recebida:', data);
      setNotificacoes((prevNotificacoes) => [
        ...prevNotificacoes,
        data.message,
      ]);
    });
    

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  return (
    <View>
      <Text>Notificações Recebidas:</Text>
      <FlatList
        data={notificacoes}
        renderItem={({ item }) => <Text>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default SininhoR;
