import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    Keyboard,
} from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import {
    TextInput,
    Snackbar,
    Checkbox,
    Button,
    HelperText,
} from 'react-native-paper';
import * as Yup from 'yup';

import { useAuth } from '../../contexts/auth';
import yupValidator from '../../utils/yupValidator';
import handlingErros from '../../utils/handlingErros';
import api from '../../services/api';

import styles from '../Styles/styles';

const New = ({ route }) => {
    const { refresh } = route.params;
    const { empresa, local } = useAuth();

    const [loading, setLoading] = useState(false);

    const nomeRef = useRef();
    const descricaoRef = useRef();

    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [is_ph, setIs_ph] = useState(false);
    const [is_od, setIs_od] = useState(false);
    const [is_ss, setIs_ss] = useState(false);
    const [is_aeracao, setIs_aeracao] = useState(false);
    const [is_observacao, setIs_observacao] = useState(false);

    const [snackbar, setSnackbar] = useState(false);
    const [error, setError] = useState({});

    async function salvar() {
        const schema = Yup.object().shape({
            nome: Yup.string().required('Nome é obrigatório'),
            descricao: Yup.string().required('Descrição é obrigatório'),
        });

        const validation = await yupValidator(schema, {
            nome,
            descricao,
        });

        setError(validation);

        if (Object.keys(validation).length !== 0) return;

        setLoading(true);
        try {
            const response = await api.post('/lagoas', {
                nome,
                descricao,
                is_ph,
                is_od,
                is_ss,
                is_aeracao,
                is_observacao,
                empresa_id: empresa.id,
                local_id: local.id,
            });
            setLoading(false);
            const { data } = response;

            setNome('');
            setDescricao('');
            setIs_ph(false);
            setIs_od(false);
            setIs_ss(false);
            setIs_aeracao(false);
            setIs_observacao(false);
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
                <TextInput
                    label="Nome:"
                    value={nome}
                    ref={nomeRef}
                    onChangeText={(text) => setNome(text)}
                    onSubmitEditing={() => descricaoRef.current.focus()}
                />
                <HelperText type="error" visible={true}>
                    {error?.nome}
                </HelperText>

                <TextInput
                    label="Descrição:"
                    value={descricao}
                    ref={descricaoRef}
                    onChangeText={(text) => setDescricao(text)}
                />
                <HelperText type="error" visible={true}>
                    {error?.descricao}
                </HelperText>

                <View
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                    }}
                >
                    <Checkbox
                        status={is_ph ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setIs_ph(!is_ph);
                        }}
                    />
                    <Text style={{ marginRight: 20 }}>pH</Text>

                    <Checkbox
                        status={is_od ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setIs_od(!is_od);
                        }}
                    />
                     <Text style={{ marginRight: 20 }}>OD</Text>

                    <Checkbox
                        status={is_ss ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setIs_ss(!is_ss);
                        }}
                    />
                    <Text>SS</Text>
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                    }}
                >
                    <Checkbox
                        status={is_aeracao ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setIs_aeracao(!is_aeracao);
                        }}
                    />
                    <Text style={{ marginRight: 20 }}>Aeração</Text>

                    <Checkbox
                        status={is_observacao ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setIs_observacao(!is_observacao);
                        }}
                    />
                    <Text>Observações</Text>
                </View>

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
