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
                            <v-text-field label="Nome" v-model="usuario.nome">
                                {{ usuario.nome }}
                            </v-text-field>

                            <v-text-field label="Email" v-model="usuario.email">
                                {{ usuario.email }}
                            </v-text-field>

                            <v-text-field
                                v-model="senha"
                                :append-icon="showSenha ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="showSenha ? 'text' : 'password'" 
                                label="Senha atual"
                                @click:append="showSenha = !showSenha"
                            />

                            <v-text-field
                                v-model="novaSenha"
                                :append-icon="showNova ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="showNova ? 'text' : 'password'" 
                                label="Nova senha"
                                @click:append="showNova = !showNova"
                            />     

                            <v-text-field
                                v-model="senhaConfirmacao"
                                :append-icon="showConfirma ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="showConfirma ? 'text' : 'password'" 
                                label="Confirme a senha"
                                @click:append="showConfirma = !showConfirma"
                            />           

                            <v-btn color="primary" :loading="carregando"  @click="atualizar">
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
        data() {
            return {
            usuario: {
                nome: this.$root.credentials.nome,
                email: this.$root.credentials.email
            },

            senha: '',
            novaSenha: '',
            senhaConfirmacao: '',
            error: '',

            carregando: false,
            showSenha: false,
            showNova: false,
            showConfirma: false,

            }
        },

        methods: {
            atualizar() {
                this.error = '';
                this.carregando = true;
                axios.put('http://localhost:3000/usuarios/' + this.usuario.email, 
                    {
                        nome: this.usuario.nome,
                        email: this.usuario.email,
                        senhaAtual: this.senha,
                        senhaNova: this.novaSenha,
                        senhaConfirmacao: this.senhaConfirmacao
                    })
                    .then(() => {
                        this.$router.replace('/login')
                    })
                    .catch((erro) => {
                        console.log("🚀 ~ file: FormAlteraRegistro.vue:68 ~ atualizar ~ erro:", erro)
                        this.error = erro.response.data.erro;
                        this.carregando = false;
                    });
            },
        }
    }
</script>