import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { FAB, DataTable } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../contexts/auth';
import handlingErros from '../../utils/handlingErros';
import formatDate from '../../utils/formatDate';
import api from '../../services/api';
import styles from '../Styles/styles';

const List = () => {
    const { empresa, local } = useAuth();
    const [loading, setLoading] = useState(false);
    const [concentracaoCloro, setConcentracaoCloro] = useState([]);
    const [error, setError] = useState('');

    const navigation = useNavigation();

    async function myAsyncEffect() {
        setLoading(true);
        try {
            const response = await api.get(`/controle-tanques?localId=${local.id}`);
            const { data } = response;
            setConcentracaoCloro(data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setConcentracaoCloro([]);
            const validation = handlingErros(error);
            setError(validation);
        }
    }

    useEffect(() => {
        myAsyncEffect();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <ActivityIndicator
                style={
                    loading === true ? { display: 'flex' } : { display: 'none' }
                }
                size="large"
                color="#0000ff"
            />
            {error.length !== 0 && (
                <Text style={styles.error}>{error?.error}</Text>
            )}

            <ScrollView>
                <ScrollView
                    horizontal
                    contentContainerStyle={{ width: 500, height: '100%' }}
                >
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title>Data</DataTable.Title>
                            <DataTable.Title>Hora</DataTable.Title>
                            <DataTable.Title>Tempo ligado 2,5cv</DataTable.Title>
                            <DataTable.Title>Tempo desligado 2,5cv</DataTable.Title>
                            <DataTable.Title>Tempo ligado 5cv</DataTable.Title>
                            <DataTable.Title>Tempo desligado 5cv</DataTable.Title>
                            <DataTable.Title>Ação Corretiva</DataTable.Title>
                            <DataTable.Title>Tanque</DataTable.Title>
                        </DataTable.Header>
                        {concentracaoCloro.map((item, index) => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => {
                                    navigation.navigate(
                                        'ControleTanqueShow',
                                        {
                                            item: item,
                                            refresh: myAsyncEffect.bind(this),
                                        }
                                    );
                                }}
                            >
                                <DataTable.Row>
                                    <DataTable.Cell>
                                        {formatDate(item.data)}
                                    </DataTable.Cell>
                                    <DataTable.Cell>
                                        {item.hora.slice(0, -3)}
                                    </DataTable.Cell>
                                    <DataTable.Cell>
                                        {item.tempo_ligado_2cv}
                                    </DataTable.Cell>
                                    <DataTable.Cell>
                                        {item.tempo_desligado_2cv}
                                    </DataTable.Cell>
                                    <DataTable.Cell>
                                        {item.tempo_ligado_5cv}
                                    </DataTable.Cell>
                                    <DataTable.Cell>
                                        {item.tempo_desligado_5cv}
                                    </DataTable.Cell>
                                    <DataTable.Cell>
                                        {item.acao_corretiva}
                                    </DataTable.Cell>
                                    <DataTable.Cell>
                                        {item?.tanque?.nome}
                                    </DataTable.Cell>
                                </DataTable.Row>
                            </TouchableOpacity>
                        ))}
                    </DataTable>
                </ScrollView>
                {concentracaoCloro.length == 0 && (
                    <Text style={styles.empty}>Desculpa, não há dados!</Text>
                )}
            </ScrollView>

            <FAB
                label="novo"
                style={styles.fab}
                icon="plus"
                onPress={() =>
                    navigation.navigate('ControleTanqueNew', {
                        refresh: myAsyncEffect.bind(this),
                    })
                }
            />
        </View>
    );
};

export default List;
