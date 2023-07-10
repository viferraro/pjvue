<template lang="html">
    <div>
        <v-row justify="center" align="center" style="margin-top: 50px">
            <loading :active.sync="loading" :can-cancel="false" :is-full-page="true"
                :color="this.$root.config.corSecundaria" :loader="'dots'"></loading>
            <v-card v-model="quadroEscolhido" width="600px">
                <v-card-title class="headline fulfillment of the user's request.">Compartilhar quadro</v-card-title>
                <v-card-text>
                    <v-select v-model="emailsSelecionados" :items="usuarios" item-text="email" item-value="email"
                        label="Usuário" outlined dense chips deletable-chips multiple></v-select>
                </v-card-text>
                <v-col>
                    <v-show v-if="usuarioEdita">
                        <v-label class="text-left">Tornar quadro editável?</v-label>
                        <v-radio-group v-model="edita" row>
                            <v-radio label="Sim" value="true"></v-radio>
                            <v-radio label="Não" value="false"></v-radio>
                        </v-radio-group>
                    </v-show>
                </v-col>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text
                        @click="dialogCompartilhar = false, emailsSelecionados = []">Cancelar</v-btn>
                    <v-btn color="green darken-1" text @click="compartilharQuadro()">Compartilhar</v-btn>
                </v-card-actions>
                <v-alert v-if="sucesso" type="success">
                    Compartilhamento realizado com sucesso!
                </v-alert>
            </v-card>
        </v-row>
    </div>
</template>  
<script>
import axios from 'axios';
export default {
    data() {
        return {
            error: '',
            loading: true,
            sucesso: false,
            dialogCompartilhar: false,
            quadroEscolhido: {},
            usuarios: [],
            emailsSelecionados: [],
            edita: false,
            usuarioEdita: false,
            httpOptions: {
                baseURL: this.$root.config.urlBack,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.$root.credentials.token
                }
            },
        }
    },
    methods: {
        //função para compartilhar o quadro escolhido com outro usuário selecionado, acrescentado na lista de quadros desse usuário
        compartilharQuadro: function () {
            axios.post(this.httpOptions.baseURL + '/usuarios/compartilhar/' + this.quadroEscolhido._id, {
                usuarios: this.emailsSelecionados
            },
                this.httpOptions)
                .then(() => {
                    this.quadroEscolhido = null;
                    this.dialogCompartilhar = false;
                    this.recuperaQuadros();
                    this.sucesso = true;
                    console.log("Quadro compartilhado com sucesso!");
                    this.$router.replace("/quadros/");
                })
                .catch(error => {
                    this.dialogCompartilhar = false;
                    this.error = error;
                });
        },
        //função para recuperar a lista de usuarios, que serão exibidos no select
        getUsuarios() {
            this.error = '';
            this.loading = true;
            this.sucesso = false;
            axios.get(this.httpOptions.baseURL + "/usuarios/", this.httpOptions)
                .then(response => {
                    this.loading = false;
                    //obter o email de cada usuário do response.data.items
                    const emailsArr = response.data.items.reduce((acc, obj) => {
                        if (this.$root.credentials.email !== obj.email) {
                            acc.push(obj.email);
                        }
                        return acc;
                    }, []);
                    this.usuarios = emailsArr;
                    console.log("🚀 ~ file: CompartilhaQuadro.vue:91 ~ getUsuarios ~ response.data:", response.data)
                }).catch(error => {
                    this.error = error.response.data.error;
                });
        },

    },
    mounted() {
        this.getUsuarios();
    }
}
</script>
