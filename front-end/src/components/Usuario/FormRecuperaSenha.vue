<template lang="html">
    <v-row v-show="!$root.credentials" class="mt-8">
        <v-col offset-md="4" md="4">
            <h2 class="form-title">Recuperação de Senha</h2>
            
            <p class="error pa-1 mb-8" v-if="error">{{ error }}</p>

            <v-form @submit.prevent="processForm">
                <div class="form-group">
                    <v-text-field v-model="form.email" label="Entre com o seu e-mail"></v-text-field>
                </div>

                <v-btn type="submit" class="primary">Envia</v-btn>
            </v-form>


        </v-col>
    </v-row>
</template>
  
<script>
import axios from 'axios';

export default {
    data() {
        return {
            form: { email: "" },
            error: ''
        }
    },

    methods: {
        processForm: function () {
            this.error = '';

            axios.post(this.$root.config.urlBack + "/usuarios/esqueci", this.form)
                .then(response => {
                    this.$root.credentials = response.data;
                })
                .catch(error => {
                    console.log("🚀 ~ file: FormLogin.vue:61 ~ error:", error)
                    this.error = error.response.data.erro;
                })
        }
    }
}
</script>
  