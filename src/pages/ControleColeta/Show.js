import React, { Component, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Button, Chip, Paragraph, Dialog, Portal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../contexts/auth';
import yupValidator from '../../utils/yupValidator';
import handlingErros from '../../utils/handlingErros';
import formatDate from '../../utils/formatDate';
import api from '../../services/api';
import styles from '../Styles/styles';

const Show = ({ route }) => {
    const { refresh } = route.params;
    const { item } = route.params;
    const [error, setError] = useState('');
    const [dialog, setDialog] = useState(false);
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);

    async function excluir() {
        setDialog(false);
        setLoading(true);
        try {
            const response = await api.delete('/controle-pastilha-cloros/' + item.id);
            setLoading(false);
            refresh();
            navigation.navigate('PastilhaCloroList');
        } catch (error) {
            setLoading(false);
            const validation = handlingErros(error);
            setError(validation);
        }
    }

    return (
        <View style={styles.container}>
            <ActivityIndicator
                style={
                    loading == true ? { display: 'flex' } : { display: 'none' }
                }
                size="large"
                color="#0000ff"
            />
            {error.length !== 0 && (
                <Text style={styles.error}>{error?.error}</Text>
            )}

            <Text style={styles.title_view}>Controle</Text>
            <Text style={styles.title_view}>Pastilha</Text>
            <Text style={styles.title_view}>Cloro</Text>

            <Text>Data: {formatDate(item.data)}</Text>
            <Text>Hora: {item.hora.slice(0, -3)}</Text>
            <Text>Quantidade: {item.quantidade}</Text>
            <View style={styles.container_row}>
                <Button
                    style={styles.button_radius}
                    icon="pencil"
                    mode="contained"
                    onPress={() =>
                        navigation.navigate('PastilhaCloroEdit', {
                            item: item,
                            refresh: refresh.bind(this),
                        })
                    }
                >
                    Editar
                </Button>
                <Button
                    style={styles.button_radius}
                    color="red"
                    icon="trash-can"
                    mode="contained"
                    onPress={() => setDialog(true)}
                >
                    Excluir
                </Button>
            </View>

            <Portal>
                <Dialog visible={dialog} onDismiss={() => setDialog(false)}>
                    <Dialog.Title>Excluir</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>
                            Realmente deseja excluir este dado?
                        </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDialog(false)}>
                            Cancelar
                        </Button>
                        <Button onPress={() => excluir()}>Excluir</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
};

export default Show;
