<template lang="html">
    <v-main>
         <v-row justify="center">
             <loading 
             v-if="loading" 
             :active="loading" 
             :can-cancel="false" 
             :text="loadingText" 
             :loader="'dots'">
            </loading>
            <h2 v-if="loading" class="form-title">{{ loadingText }}</h2>
        </v-row>


        <v-col v-if="!loading" offset-md="4" md="4">
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
        
                <v-btn 
                    type="submit"
                    :loading="carregando"
                    class="primary"
                >
                    Envia
                </v-btn>
            </v-form>
        
            <div class="mt-12">
                <router-link :to="{ name: 'esqueci' }" replace>
                Recuperar a minha senha
                </router-link>
            </div>
        </v-col>            
    </v-main>
</template>  

<script>

import axios from 'axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
    data() {
        return {
            error: '',
            loading: true,
            idQuadro: this.$route.query.idQuadro,
            email: this.$route.query.email,

            form: { email: "", senha: "" },
            carregando: false,
            show: false,

            loadingText: 'Adicionando o quadro à conta...',
            
            httpOptions: {
                baseURL: this.$root.config.urlBack,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            },
        }
    },

    components: {
        Loading
    },

    methods: {
        //função para compartilhar o quadro 
        compartilharQuadro: function () {
            
            axios.put('http://localhost:3000/usuarios/quadros/' + this.email, {
                quadro: this.idQuadro
            })
            .then(() => {
                setTimeout(() => {
                    this.loading = false;
                    }, 5000);
            }).catch(error => {
                this.error = error.response.data.error;
            });
        },
        
        processForm: function() {
        this.error = '';
        this.carregando = true;

        axios.post(this.$root.config.urlBack + "/usuarios/login", this.form)
          .then(response => {
            this.$root.credentials = response.data.usuario;
            this.$router.replace("/quadros/detalhar/" + this.idQuadro)
          })
          .catch(error => {
            this.error = error.response.data.erro;
            this.carregando = false;
          })
      }
    },

    mounted() {
        this.compartilharQuadro();
    }
}
</script>
