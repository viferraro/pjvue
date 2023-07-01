<template>
    <v-container>
      <v-main class="bg-grey-lighten-3bg">
        <!-- <p v-if="!$root.credentials">
          <router-link class="link" :to="{ name: 'login' }">
            <a class="btn btn-lg btn-success" href="#" role="button">Login</a>
          </router-link>
        </p> -->

        <v-container>

          <!-- Inserindo um v-for para os dados dos itens -->
          <v-row>
            <v-col cols="4">
              <v-sheet :rounded=true>
                <v-list :rounded=true>
                  <v-list-item link>
                    <v-list-item-title>
                      Listar quadros
                    </v-list-item-title>
                  </v-list-item>
  
                  <v-divider class="my-2"></v-divider>
  
                  <v-list-item link color="grey-lighten-4" @click="novoQuadro">
                    <v-list-item-title>
                      Criar novo quadro
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-sheet>
            </v-col>
  
            
            <v-row v-if="items.length > 0" justify="space-around">
              <v-sheet v-for="item in items" :key="item._id" min-height="70vh" :rounded=true>
                <v-card>
                  <v-app-bar dark color="blue-grey darken-2">
                    <v-toolbar-title>{{ item.nome }}</v-toolbar-title>
  
                    <v-spacer></v-spacer>
  
                    <v-btn class="ma-2" color="black">
                      <v-icon end icon="mdi-plus" x-small>Tarefa</v-icon>
                      <v-icon small>mdi-plus-circle</v-icon>
                    </v-btn>
  
                  </v-app-bar>
  
                </v-card>
                
              </v-sheet>
            </v-row>

            <h1 v-else>Não há quadros cadastrados</h1>
          </v-row>
          
  
          <!-- <v-row>
            <v-col cols="2">
              <v-sheet :rounded=true>
                <v-list :rounded=true>
                  <v-list-item v-for="n in 2" :key="n" link>
                    <v-list-item-title>
                      List Item {{ n }}
                    </v-list-item-title>
                  </v-list-item>
  
                  <v-divider class="my-2"></v-divider>
  
                  <v-list-item link color="grey-lighten-4">
                    <v-list-item-title>
                      Refresh
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-sheet>
            </v-col>
  
            <v-row justify="space-around">
              <v-sheet v-for="usuario in usuarios" :key="usuario.id" min-height="70vh" :rounded=true>
                <v-card max-width="200" class="mx-auto">
  
                  <v-app-bar dark color="blue-grey darken-2">
                      <v-toolbar-title>{{ usuario }}</v-toolbar-title>
  
                    <v-spacer></v-spacer>
  
                    <v-btn class="ma-2" color="black">
                      <v-icon end icon="mdi-plus" x-small>Tarefa</v-icon>
                      <v-icon small>mdi-plus-circle</v-icon>
                    </v-btn>
  
                  </v-app-bar>
  
                  
                  <v-list-item-group>
                    <v-list-item v-for="item in items" :key="item.id">
                      <v-list-item-content>
                        <v-list-item-title>{{ item }}</v-list-item-title>
                      </v-list-item-content>
  
                      <v-list-item-action>
                        <v-icon color="grey lighten-1">mdi-drag</v-icon>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list-item-group>
                  
                </v-card>
              </v-sheet>
            </v-row>
          </v-row> -->
        </v-container>
      </v-main>
    </v-container>
  </template>
  
  <script>

    import axios from 'axios';

    export default {
      data() {
        return {
            items: [],
            error: "",

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
        retornaQuadros: function() {
          axios.get(this.httpOptions.baseURL +'/quadros', this.httpOptions)
          .then(response => {
            console.log(this.httpOptions.baseURL +'/quadros');
            console.log(response.data());
            this.items = response.data.quadros;
          })
          .catch(error => {
            this.error = error;
          })
        },

        novoQuadro: function() {
          this.$router.replace("/quadros/novo")
        }
      },

      mounted() {
        console.log(this.$root.credentials);
        this.retornaQuadros();
      }
    }


  
  </script>