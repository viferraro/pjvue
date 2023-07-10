<template>
  <v-main>
    <v-container>

      <!-- Tela de carregamento e barra de erro -->
      <v-row justify="center">
        <loading :active.sync="loading" :can-cancel="false" :is-full-page="true"
          :color="this.$root.config.corSecundaria" :loader="'dots'"></loading>
      </v-row>
      <p class="error pa-1 mb-8" v-if="error">{{error}}</p>

      <v-show v-if="!loading">
        <v-col cols="3"
        >
          <v-row center>
              <v-label class="text-h4" :style="{ color: quadro.corTexto }">{{ quadro.titulo }}</v-label>
          </v-row>
        </v-col> 
        
        <v-sheet class="mx-auto" elevation="8" max-width="100%" :style="`background-color: ${quadro.corFundo}`">
          <v-slide-group show-arrows class="pa-4" name="slide-group-listas">
            <v-slide-group-item v-for="lista in listas" :key="lista._id" name="slide-item-listas">
              <v-card color="grey-lighten-1" :class="['ma-4']" max-height="100%" width="400">
                <div class=" fill-height justify-center">
                      <v-card class="mx-auto" width="400" elevation="15" :style="{ backgroundColor: quadro.corFundo }">
                          <v-card-title class="headline" :style="{ color: quadro.corTexto }">
                            <v-row justify="space-between">
                            {{ lista.titulo }}

                            <v-show v-if="permiteEdicao(quadro.editavel)">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn icon v-on="on" color="warning" @click="abrirEditarLista(lista)">
                                    <v-icon>mdi-pencil-circle</v-icon>
                                  </v-btn>
                                </template>
                                <span>Editar lista</span>
                              </v-tooltip>

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn icon v-on="on" color="error" @click="abrirExcluir(lista)">
                                    <v-icon>mdi-delete-circle</v-icon>
                                  </v-btn>
                                </template>
                                <span>Excluir lista</span>
                              </v-tooltip>
                            </v-show>

                            </v-row>
                          </v-card-title>
                      <v-list-item>
                          <v-list-item-content>                       

                          <v-list v-for="card in lista.cards" :key="card" :style="{ backgroundColor: quadro.corFundo }"
                              >
                                  <v-card @click="editItem(lista, card)" :style="{ backgroundColor: corAjustada(quadro.corFundo) }" class="mx-auto" width="400" elevation="15">
                                      <v-card-text class="text-h7 multiline" :style="{ color: quadro.corTexto }">
                                          {{ card.conteudo }}
                                      </v-card-text>
                                  </v-card>
                          </v-list>

                          </v-list-item-content>
                      </v-list-item>
                      </v-card>
                </div>
              </v-card>
            </v-slide-group-item>
          </v-slide-group>

          <!-- Exibindo um v-dialgo para editar uma lista -->
          <v-dialog v-model="dialogLista" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline">{{ listaEditada === null ? "" : listaEditada.titulo }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="12">
                      <v-text-field v-model="novoTitulo" label="Título"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <!-- Adicionando um v-radio com a opção de incluir um quadro com seu conteúdo -->
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-label>Adicionar um card?</v-label>
                      <v-radio-group v-model="adicionaCard" row mandatory>
                        <v-radio label="Sim" value="true" ></v-radio>
                        <v-radio label="Não" value="false"></v-radio>
                      </v-radio-group>
                    </v-col>

                    <!-- Exibindo o v-textarea para incluir o conteúdo do card caso adicionaCard seja true -->
                    <v-col cols="12" sm="6" md="8" v-if="adicionaCard === 'true'">
                      <v-textarea v-model="cardEditado.conteudo" label="Conteúdo"></v-textarea>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>



              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialogLista = false, resetarVariaveis">Cancelar</v-btn>
                <v-btn color="blue darken-1" text @click="atualizaLista">Salvar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Exibindo um v-dialog para editar e excluir um card de uma lista -->
          <v-dialog v-model="dialogCard" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline">{{ listaEditada === null ? "" : listaEditada.titulo }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="12">
                      <v-textarea v-model="conteudoNovo" label="Conteúdo"></v-textarea>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-text>
                <v-container>
                  <v-row>
                      <v-col cols="12" sm="6" md="4">
                          <v-label>Trocar para outra lista?</v-label>
                          <v-radio-group v-model="trocaLista" row>
                              <v-radio label="Sim" value="true"></v-radio>
                              <v-radio label="Não" value="false"></v-radio>
                            </v-radio-group>
                      </v-col>

                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="listaNova"
                        :items="listasDiferentes"
                        label="Lista"
                        item-text="titulo"
                        item-value="_id"
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialogCard = false, resetarVariaveis">Cancelar</v-btn>
                <v-btn color="blue darken-1" text @click="atualizaCard">Salvar</v-btn>
                <v-btn color="error" text @click="deleteItem">Excluir</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

        </v-sheet>   
      </v-show>   
    </v-container>
  </v-main>
</template>

<script>
  import axios from 'axios';

  export default {
    
    data() {
        return {

            loading: false,
            menuFundo: false,
            menuTexto: false,
            lightenAmount: 0.3,
            
            dialogLista: false,
            dialogCard: false,
            listaEditada: null,
            cardEditado: null || "",
            adicionaCard: true,
            conteudoNovo: "",
        
            trocaLista: false,
            listaNova: null,
            quadro: null,
            listas: [],
            listasDiferentes: [],
            novoTitulo: "",


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

        // Ajusta a cor de fundo de cada lista do quadro
        corAjustada: function (color) {
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

        // Reseta o valor default das variáveis
        resetarVariaveis: function () {
            this.listaEditada = null;
            this.cardEditado = null;
            this.trocaLista = false;
            this.listaNova = null;
            this.listasDiferentes = [];
            this.novoTitulo = "";
            this.adicionaCard = true;
        },

        // Retorna se o quadro é editável pelo usuário
        permiteEdicao: function (editaveis) {
          var email = this.$root.credentials.email;

          if (editaveis.includes(email)) {
            return true;

          }
          else {
            return false;
          }
        },

        // Abre a caixa de diálogo para editar uma lista
        abrirEditarLista: function(lista) {
            this.listaEditada = lista;
            this.dialogLista = true;
            this.novoTitulo = lista.titulo;
            this.cardEditado = {
                conteudo: ""
            };
        },

        // Atualiza a lista editada
        atualizaLista: function(){
            this.loading = true;
            var lista = this.listaEditada;
            var conteudoNovo = this.conteudoNovo;
            console.log("🚀 ~ file: DetalhamentoQuadro.vue:271 ~ card:", conteudoNovo)
            axios.put(this.httpOptions.baseURL + '/listas/' + lista._id, {
              titulo: lista.titulo,
              conteudoCard: conteudoNovo
            })
            .then(() => {
                this.dialog = false;
                this.loading = false;
                this.recuperaListas();
                this.resetarVariaveis();
            })
            .catch((error) => {
                this.loading = false;
                this.error = error;
                console.log(error);
            });
        },

        // Abre a caixa de diálogo para editar um card
        editItem: function(lista, card) {
            this.listaEditada = lista;
            this.cardEditado = card;
            this.listasDiferentes = this.listas.filter((listaAtual) => listaAtual !== lista);
            console.log("🚀 ~ file: DetalhamentoQuadro.vue:165 ~ editItem ~ this.listasDiferentes:", this.listasDiferentes)
            this.dialogCard = true;
        },

        // Salva as alterações feitas em uma lista
        atualizaCard: function () {
            this.loading = true;
            var idLista = this.listaEditada._id;
            var card = this.cardEditado;
            console.log("🚀 ~ file: DetalhamentoQuadro.vue:172 ~ card:", this.cardEditado)

            console.log("🚀 ~ file: DetalhamentoQuadro.vue:177 ~ idLista:", idLista)
            
            if (this.trocaLista) {
                axios.put(this.httpOptions.baseURL + '/listas/' + this.listaNova + '/card', card)
                .then(() => {
                    console.log("🚀 ~ file: DetalhamentoQuadro.vue:197 ~ card._id:", card._id)

                    axios.delete(this.httpOptions.baseURL + '/listas/' + idLista + '/card/' + card._id)
                    .then(() => {
                            this.dialogCard = false;
                            this.resetarVariaveis();
                            this.recuperaListas();
                        })
                        .catch(error => {
                            this.error = error;
                            this.loading = false;
                        });
                })
                .catch(error => {
                    this.error = error;
                    this.loading = false;
                });
            }
            
            else {
            axios.put(this.httpOptions.baseURL + '/listas/' + idLista + '/card', this.cardEditado)
                .then(() => {
                    this.dialogCard = false;
                    this.resetarVariaveis();
                    this.recuperaListas();
                })
                .catch(error => {
                    this.error = error;
                    this.loading = false;
                });
            }
        },
        

        //função para recuperar um quadro específico
        recuperaQuadro: function () {
            this.quadro = null;
            this.loading = true;
            var idQuadro = this.$route.params.id;

            axios.get('/quadros/' + idQuadro, this.httpOptions)
                .then(response => {
                    this.quadro = response.data;
                })
                .catch(error => {
                    this.error = error;
                    this.loading = false;
                });
        },

        //função para recuperar as listas de um quadro específico
        recuperaListas: function () {
            this.listas = null;
            this.loading = true;

            var idQuadro = this.$route.params.id;
            var queryString = `idQuadro=${idQuadro}`;
            
            axios.get('/listas?' + queryString, this.httpOptions)
                .then(response => {
                    this.listas = response.data.items;
                    this.totalCards = response.data.totalCards;
                    this.loading = false;
                })
                .catch(error => {
                    this.error = error;
                    this.loading = false;
                });
        },
        
    },

    mounted() {
        this.recuperaQuadro();
        this.recuperaListas();
    }
}

</script>

<style>
    .multiline {
    white-space: normal;
    }
</style>
