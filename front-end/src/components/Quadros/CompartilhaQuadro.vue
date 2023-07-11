<template lang="html">
    <v-main>
         <v-row justify="center">
            <loading :active.sync="loading" :can-cancel="false" :is-full-page="true"
            :color="this.$root.config.corSecundaria" :loader="'dots'"></loading>
        </v-row>
        <v-row justify="center">
            <v-label class="text-h5" color="this.$root.config.corSecundaria">Redirecionando para a página de login...</v-label>
        </v-row>
    </v-main>
</template>  
<script>
import axios from 'axios';
export default {
    data() {
        return {
            error: '',
            loading: true,
            idQuadro: this.$route.query.idQuadro,
            email: this.$route.query.email,
            
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
        //função para compartilhar o quadro 
        compartilharQuadro: function () {
            axios.put(this.httpOptions.baseURL + '/usuarios/' + this.email, {
                quadro: this.idQuadro
            })
            .then(() => {
                this.$router.replace('/login');
            }).catch(error => {
                this.error = error.response.data.error;
            });
        },        
    },

    mounted() {
        this.compartilharQuadro();
    }
}
</script>
