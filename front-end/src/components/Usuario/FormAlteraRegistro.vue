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
                            <v-text-field label="Nome">
                                <!-- {{ usuario.nome }} -->
                            </v-text-field>
                            <v-text-field label="email">
                                <!-- {{ usuario.email }} -->
                            </v-text-field>
                            <v-text-field @change="comparaSenha" label="Senha Atual" v-model="senha" type="password" id="senhaHide">

                            </v-text-field>
                            <v-text-field @change="alterarSenha" v-model="senhaConfirmacao" label="Nova Senha" type="password">
                            
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
        usuario: null,
        senha: '',
        senhaConfirmacao: '',
        error: '',
    }),
    methods: {
        registrar() {
            axios.post('http://localhost:3000/usuarios', {
                    nome: this.usuario.nome,
                    email: this.usuario.email,
                    senha: this.senha,
                    senhaConfirmacao: this.senhaConfirmacao
                })
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
            var email = this.$root.credentials.email;
            console.log("🚀 ~ file: FormAlteraRegistro.vue:87 ~ recuperaUsuario ~ email:", email)
            axios.get('http://localhost:3000/usuarios/' + email)
                .then((response) => {
                    console.log(response.data);
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