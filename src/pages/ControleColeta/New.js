import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    Keyboard,
} from 'react-native';
import {
    TextInput,
    Snackbar,
    Button,
    RadioButton,
    HelperText,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CustomPicker } from 'react-native-custom-picker';
import * as Yup from 'yup';

import { useAuth } from '../../contexts/auth';
import yupValidator from '../../utils/yupValidator';
import handlingErros from '../../utils/handlingErros';
import formatDate from '../../utils/formatDate';
import api from '../../services/api';

import styles from '../Styles/styles';

const New = ({ route }) => {
    const { refresh } = route.params;
    const { empresa, local } = useAuth();

    const [loading, setLoading] = useState(false);

    const [data, setData] = useState(Date.now());
    const [status_coleta, setStatus_coleta] = useState(1);
    const [condicao_coleta, setCondicao_coleta] = useState(1);

    const [show_data, setShow_data] = useState(false);

    const [snackbar, setSnackbar] = useState(false);
    const [error, setError] = useState({});

    async function salvar() {
        const schema = Yup.object().shape({
            status_coleta: Yup.string()
                .min(1)
                .required('Problema é obrigatório'),
            condicao_coleta: Yup.string()
                .min(1)
                .required('Problema é obrigatório'),
        });

        const validation = await yupValidator(schema, {
            status_coleta,
            condicao_coleta,
        });

        setError(validation);

        if (Object.keys(validation).length !== 0) return;

        setLoading(true);
        try {
            const response = await api.post('/controle-coletas', {
                data: formatDate(data, 'yyyy-MM-dd'),
                status_coleta,
                condicao_coleta,
                empresa_id: empresa.id,
                local_id: local.id,
            });
            setLoading(false);
            // const { data } = response;

            setData(Date.now());
            setStatus_coleta(1);
            setCondicao_coleta(1);
            setSnackbar(true);
            refresh();
        } catch (error) {
            setLoading(false);
            const validation = handlingErros(error);
            setError(validation);
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <View style={styles.container_data}>
                    <Text style={{ marginLeft: 5, marginTop: 40 }}>Data:</Text>
                    <Button icon="calendar" onPress={() => setShow_data(true)}>
                        {formatDate(data)}
                    </Button>
                </View>

                <Text style={{ marginTop: 30 }}>Status:</Text>
                <View style={styles.container_row}>
                    <Text>Realizada</Text>
                    <RadioButton
                        value="1"
                        status={status_coleta === 1 ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setStatus_coleta(1);
                        }}
                    />

                    <Text style={{ marginLeft: 30 }}>Adiada</Text>
                    <RadioButton
                        value="2"
                        status={status_coleta === 2 ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setStatus_coleta(2);
                        }}
                    />
                </View>

                <HelperText type="error" visible={true}>
                    {error?.status_coleta}
                </HelperText>

                <Text style={{ marginTop: 30 }}>
                    Condições de coleta (tempo e clima):
                </Text>
                <View style={styles.container_row}>
                    <Text>Ensoralado</Text>
                    <RadioButton
                        value="1"
                        status={condicao_coleta === 1 ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setCondicao_coleta(1);
                        }}
                    />

                    <Text style={{ marginLeft: 30 }}>Chuvoso</Text>
                    <RadioButton
                        value="2"
                        status={condicao_coleta === 2 ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setCondicao_coleta(2);
                        }}
                    />

                    <Text style={{ marginLeft: 30 }}>Garoa</Text>
                    <RadioButton
                        value="3"
                        status={condicao_coleta === 3 ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setCondicao_coleta(3);
                        }}
                    />
                </View>

                <HelperText type="error" visible={true}>
                    {error?.condicao_coleta}
                </HelperText>

                {show_data && (
                    <DateTimePicker
                        value={data}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        onChange={(event, date) => {
                            setShow_data(false);
                            if (typeof date !== 'undefined') {
                                setData(date);
                            }
                        }}
                    />
                )}

                <ActivityIndicator
                    style={
                        loading === true
                            ? { display: 'flex' }
                            : { display: 'none' }
                    }
                    size="large"
                    color="#0000ff"
                />
                {error.length !== 0 && (
                    <Text style={styles.error}>{error?.error}</Text>
                )}

                <Button
                    icon="content-save"
                    style={{ marginTop: 20 }}
                    mode="contained"
                    disabled={loading}
                    onPress={() => {
                        Keyboard.dismiss();
                        salvar();
                    }}
                >
                    Salvar
                </Button>
            </ScrollView>
            <Snackbar
                visible={snackbar}
                onDismiss={() => setSnackbar(false)}
                action={{
                    label: 'OK',
                    onPress: () => {},
                }}
            >
                Adicionado com sucesso!!!
            </Snackbar>
        </View>
    );
};

export default New;
