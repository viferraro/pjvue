<template lang="html">
  <v-row v-show="!$root.credentials" class="mt-8">
    <v-col offset-md="4" md="4">
      <h2 class="form-title">Login</h2>
      <h5 class="form-subtitle mb-8">Entre com as suas credenciais para o login.</h5>

      <p class="error pa-1 mb-8" v-if="error">{{error}}</p>

      <v-form @submit.prevent="processForm">
        <div class="form-group">
          <v-text-field v-model="form.email" label="Entre o seu e-mail" ></v-text-field>
        </div>

        <div class="form-group">
          <v-text-field 
            v-model="form.senha" 
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'" 
            label="Entre com a sua senha" 
            @click:append="show = !show"></v-text-field>
        </div>

        <v-btn type="submit" :loading="carregando" class="primary">Envia</v-btn>
      </v-form>

      <div class="mt-12">
        <router-link :to="{ name: 'esqueci' }" replace>
          Recuperar a minha senha
        </router-link>
      </div>
      
      <div class="mt-2">
        <router-link :to="{ name: 'registro' }" replace>
          Criar nova conta
        </router-link>
      </div>
    </v-col>
  </v-row>
</template>

<script>
  import axios from 'axios';

  export default {
    data() {
      return {
        form: { email: "", senha: "" },
        error: '',

        carregando: false,
        show: false,
      }
    },

    methods: {
      processForm: function() {
        this.error = '';
        this.carregando = true;

        axios.post(this.$root.config.urlBack + "/usuarios/login", this.form)
          .then(response => {
            this.$root.credentials = response.data.usuario;
            this.$router.replace('/quadros');
          })
          .catch(error => {
            this.error = error.response.data.erro;
            this.carregando = false;
          })
      }
    }
  }
</script>