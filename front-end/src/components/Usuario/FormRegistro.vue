<template>
    <v-container>
        <v-row align="center" justify="center" >
        <v-col cols="12" md="6">
            <p class="error pa-1 mb-8" v-if="error">{{error}}</p>
            <v-card>
            <v-card-title>
                <h3>Novo usuário</h3>
            </v-card-title>
            <v-card-text>
                <v-form>
                <v-text-field
                    v-model="usuario.nome"
                    label="Nome"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="usuario.email"
                    label="E-mail"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="usuario.senha"
                    label="Senha"
                    required
                    type="password"
                ></v-text-field>
                <v-text-field
                    v-model="usuario.senhaConfirmacao"
                    label="Confirmação de senha"
                    required
                    type="password"
                ></v-text-field>
                <v-btn
                    color="primary"
                    @click="registrar"
                >
                    Registrar
                </v-btn>
                </v-form>
            </v-card-text>
            </v-card>
        </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import axios from 'axios';

    export default {
        data: () => ({
            usuario: {
                nome: '',
                email: '',
                senha: '',
                senhaConfirmacao: ''
            },
            error: ''
        }),
        methods: {
            registrar() {
                axios.post('http://localhost:3000/usuarios', this.usuario)
                    .then(() => {
                        this.$router.replace('/login')
                    })
                    .catch((erro) => {
                        console.log(erro);
                        this.error = erro.response.data.message;
                    });
            }
        }
    }
</script>