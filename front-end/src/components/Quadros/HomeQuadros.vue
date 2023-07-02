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
            
            <v-row v-if="quadros.length > 0" justify="space-around">
              <v-col v-for="quadro in quadros" :key="quadro.id" cols="4">
                <v-sheet
                class="mx-auto"
                max-width="344"
                tile
              >
                <v-row
                  class="fill-height"
                  align="center"
                  justify="center"
                >
                  <v-col cols="12">
                    <v-card
                      class="mx-auto"
                      max-width="500"
                      elevation="15"
                      :style="{ backgroundColor: quadro.corFundo}"
                    >
                    <v-list-item three-line>
                      <v-list-item-content>
                          <v-row>    
                            <v-col
                              cols="10"
                              justify="space-between"
                            >                      
                              <v-list-item-title 
                                class="headline mb-1"
                                :style="{ color: quadro.corTexto }"
                              >
                                {{ quadro.titulo }}
                              </v-list-item-title>
                            </v-col>                      
                            <v-icon v-if="quadro.favorito" color="warning">mdi-star</v-icon> 
                          </v-row>
                          <v-list v-for="itemLista in 5" :key="itemLista" :style="{ backgroundColor: corAjustada(quadro.corFundo) }">
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-title
                                  :style="{ color: quadro.corTexto }"
                                >Lista {{ itemLista }}
                              </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list>
                        </v-list-item-content>
                      </v-list-item>
                    </v-card>
                  </v-col>
                </v-row>
                </v-sheet>
              </v-col>
            </v-row>

            <v-row v-else>
              <h1>Não há quadros cadastrados</h1>
          </v-row>
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
            quadros: [],

            lightenAmount: 0.3,
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
        corAjustada(color) {
          var amount = this.lightenAmount;
          // Remove o caractere '#' da cor hexadecimal
          const hexColor = color.replace('#', '');

          // Converte a cor hexadecimal para os valores de RGB
          const red = parseInt(hexColor.substr(0, 2), 16);
          const green = parseInt(hexColor.substr(2, 2), 16);
          const blue = parseInt(hexColor.substr(4, 2), 16);

          // Calcula a cor clareada com base no valor fornecido
          const lightenedRed = Math.round(red + (255 - red) * amount);
          const lightenedGreen = Math.round(green + (255 - green) * amount);
          const lightenedBlue = Math.round(blue + (255 - blue) * amount);

          // Converte os valores de RGB de volta para a cor hexadecimal
          const lightenedHex = '#' +
            lightenedRed.toString(16).padStart(2, '0') +
            lightenedGreen.toString(16).padStart(2, '0') +
            lightenedBlue.toString(16).padStart(2, '0');

          // Retorna a cor clareada no formato hexadecimal
          return lightenedHex;
        },

        retornaQuadros: function() {
          console.log("Retornando quadros");
          axios.get(this.httpOptions.baseURL +'/quadros', this.httpOptions)
          .then(response => { 
            console.log(response.data);
            this.quadros = response.data.quadros;
          })
          .catch(error => {
            console.log(error);
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