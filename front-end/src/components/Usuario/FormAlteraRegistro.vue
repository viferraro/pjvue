<template>
    <v-container>
        <v-row align="center" justify="center">
            <v-col cols="12" md="6">
                <p class="error pa-1 mb-8" v-if="error">{{ error }}</p>
                <v-card>
                    <v-card-title>
                        <h3>Meus Dados</h3>
                    </v-card-title>
                    <v-card-text>
                        <v-form>
                            <v-text-field v-model="usuario.nome" label="Nome">
                                {{ usuario.nome }}
                            </v-text-field>
                            <v-text-field v-model="usuario.email" label="email">
                                {{ usuario.email }}
                            </v-text-field>
                            <v-text-field @change="comparaSenha" label="Senha Atual" type="password" id="senhaHide">

                            </v-text-field>
                            <v-text-field @change="alterarSenha" v-model="usuario.novaSenha" label="Nova Senha" type="password">
                                {{ usuario.senha }}
                            </v-text-field>

                            <v-btn color="primary" @click="registrar">
                                Alterar
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
            senhaAtual: '',
            novaSenha: ''
        },
        error: '',
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
        },

        //Função para registrar uma nova senha
        alterarSenha() {
            this.senha = "";
            axios.put('http://localhost:3000/usuarios', this.usuario.novaSenha)
                .then(() => {
                    this.$router.replace('/login')
                })
                .catch((erro) => {
                    console.log(erro);
                    this.error = erro.response.data.message;
                });
        },

        comparaSenha() {
            if (this.usuario.senhaAtual !== this.usuario.novaSenha) {
                this.error = 'Senhas não conferem';
            } else {
                this.error = '';
            }
        },

        //função para recuperar o usuário logado	
        recuperaUsuario() {
            axios.get('http://localhost:3000/usuarios')
                .then((response) => {
                    this.usuario = response.data;
                })
                .catch((erro) => {
                    console.log(erro);
                });
        },

        mounted() {
            this.recuperaUsuario();
        }

    }
}
</script>


//Definindo um estilo para ocultar o campo da senha atual
<style scoped>
#senhaHide {
    display: none;
}
</style>