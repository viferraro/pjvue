<template lang="html">
    <v-row v-show="!$root.credentials" class="mt-10">
        <v-col offset-md="5" md="4">
            <h2 class="form-title">Redefina sua Senha</h2>

            <p class="error pa-1 mb-8" v-if="error">{{ error }}</p>

            <template>
                <v-form @submit.prevent="redefine">
                    <v-container>
                        <v-row class="mt-10">
                            <v-col cols="12" sm="6">
                                <v-text-field v-model="form.senha" type="password" label="Nova Senha"
                                    outlined></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" sm="6">
                                <v-text-field v-model="form.senhaConfirmacao" type="password" label="Confirme a Senha"
                                    outlined></v-text-field>
                            </v-col>

                        </v-row>
                        <v-btn type="submit" class="primary" router-link :to="{ name: 'login' }" replace>
                            ENVIAR
                        </v-btn>
                    </v-container>
                </v-form>
            </template>

        </v-col>
    </v-row>
</template>
  
<script>
import axios from 'axios';

export default {
    data() {
        return {
            form: { senha: "" },
            error: ''
        }
    },

    methods: {
        redefine: function () {
            this.error = '';

            axios.post(this.$root.config.urlBack + "/usuarios/novaSenha", this.form)
                .then(response => {
                    this.$root.credentials = response.data;
                    this.$router.replace('/login');
                })
                .catch(error => {
                    console.log("🚀 ~ file: FormLogin.vue:61 ~ error:", error)
                    this.error = error.response.data.erro;
                })
        }
    }
}
</script>