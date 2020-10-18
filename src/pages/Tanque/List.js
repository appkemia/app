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
import api from '../../services/api';
import styles from '../Styles/styles';

const List = () => {
    const { empresa, local } = useAuth();
    const [loading, setLoading] = useState(false);
    const [tanques, setTanques] = useState([]);
    const [error, setError] = useState('');

    const navigation = useNavigation();

    async function myAsyncEffect() {
        setLoading(true);
        try {
            const response = await api.get(`/tanques?localId=${local.id}`);
            const { data } = response;
            setTanques(data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setTanques([]);
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
                            <DataTable.Title>Nome</DataTable.Title>
                            <DataTable.Title>Descrição</DataTable.Title>
                        </DataTable.Header>
                        {tanques.map((item, index) => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => {
                                    navigation.navigate('TanqueShow', {
                                        item: item,
                                        refresh: myAsyncEffect.bind(this),
                                    });
                                }}
                            >
                                <DataTable.Row>
                                    <DataTable.Cell>{item.nome}</DataTable.Cell>
                                    <DataTable.Cell>
                                        {item.descricao}
                                    </DataTable.Cell>
                                </DataTable.Row>
                            </TouchableOpacity>
                        ))}
                    </DataTable>
                </ScrollView>
                {tanques.length == 0 && (
                    <Text style={styles.empty}>Desculpa, não há dados!</Text>
                )}
            </ScrollView>

            <FAB
                label="novo"
                style={styles.fab}
                icon="plus"
                onPress={() =>
                    navigation.navigate('TanqueNew', {
                        refresh: myAsyncEffect.bind(this),
                    })
                }
            />
        </View>
    );
};

export default List;
