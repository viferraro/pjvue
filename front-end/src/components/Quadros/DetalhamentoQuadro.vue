<template>
  <v-container>
    <v-main class="bg-grey-lighten-3bg">
      <v-container>

        <v-row>
          <v-col cols="2">
            <v-sheet :rounded=true>
              <v-list :rounded=true>
                <v-list-item link @click="recuperaQuadros" >
                  <v-list-item-title>
                    Atualizar Listas
                  </v-list-item-title>
                </v-list-item>

                <v-divider class="my-2"></v-divider>

                <v-list-item link color="grey-lighten-4" v-if="permiteEdicao(quadro.editavel)" @click="abrirNovaLista(quadro)">
                  <v-list-item-title>
                    Criar nova lista
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-col>

          <v-col cols="10">
            <!-- <loading :active="loading" :is-full-page="true" /> -->

            <!-- Tela de carregamento -->
            <v-row justify="center">
              <loading :active.sync="loading" :can-cancel="false" :is-full-page="true" :color="this.$root.config.corSecundaria" :loader="'dots'"></loading>
            </v-row>
            <!-- <v-div v-show="error" /> -->

            <v-sheet
                class="mx-auto"
                elevation="8"
                max-width="100%"
            >
              <v-slide-group
                  show-arrows
                  class="pa-4"
                  name="slide-group-quadros"
              >
                <v-slide-group-item
                    v-for="lista in quadro.listas"
                    :key="lista._id"
                    name="slide-item-lista"
                >
                  <v-card
                      v-if="quadros.length > 0"
                      color="grey-lighten-1"
                      :class="['ma-4']"
                      max-height="100%"
                      width="344"
                  >
                    <div class=" fill-height justify-center">
                      <v-card
                          class="mx-auto"
                          width="344"
                          elevation="15"
                          :style="{ backgroundColor: quadro.corFundo}"
                      >
                        <v-list-item >
                          <v-list-item-content>
                            <v-row>
                              <v-col
                                  cols="10"
                                  justify="space-between"
                              >
                                <v-hover
                                    v-slot="{ hover }"
                                >
                                  <v-list-item-title
                                      class="headline mb-1"
                                      :style="{ color: quadro.corTexto }"
                                  >

                                    {{ lista.titulo }}

                                    <v-expand-transition>
                                      <div
                                          v-if="hover"
                                          class="d-flex transition-fast-in-fast-out "
                                          style="height: 100%;"
                                      >

                                        <v-tooltip bottom>
                                          <template v-slot:activator="{ on }">
                                            <v-btn
                                                icon
                                                v-on="on"
                                                color="black"
                                                @click="detalharLista(lista._id)"
                                            >
                                              <v-icon>mdi-eye-circle</v-icon>
                                            </v-btn>
                                          </template>
                                          <span>Detalhar lista</span>
                                        </v-tooltip>

                                        <v-show v-if="permiteEdicao(quadro.editavel)">
                                          <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                              <v-btn
                                                  icon
                                                  v-on="on"
                                                  color="warning"
                                                  @click="editarLista(lista._id)"
                                              >
                                                <v-icon>mdi-pencil-circle</v-icon>
                                              </v-btn>
                                            </template>
                                            <span>Editar lista</span>
                                          </v-tooltip>

                                          <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                              <v-btn
                                                  icon
                                                  v-on="on"
                                                  color="error"
                                                  @click="abrirExcluir(lista)"
                                              >
                                                <v-icon>mdi-delete-circle</v-icon>
                                              </v-btn>
                                            </template>
                                            <span>Excluir lista</span>
                                          </v-tooltip>
                                        </v-show>

                                      </div>
                                    </v-expand-transition>

                                  </v-list-item-title>
                                </v-hover>
                              </v-col>

                              <v-col
                                  justify="space-between"
                              >

                              </v-col>

                            </v-row>

                            <v-list  v-for="card in lista" :key="card._id"  :style="{ backgroundColor: corAjustada(quadro.corFundo) }">
                              <v-list-item>
                                <v-list-item-content>
                                  <v-list-item-title
                                      :style="{ color: quadro.corTexto }"
                                  >{{ card.titulo }}
                                  </v-list-item-title>
                                </v-list-item-content>
                              </v-list-item>
                            </v-list>

                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-title>
                                  <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                      <v-btn
                                          icon
                                          v-if="permiteEdicao(quadro.editavel)"
                                          v-on="on"
                                          :style="{ color: quadro.corTexto }"
                                          @click="abrirNovoCard(quadro)"
                                      >
                                        <v-icon>mdi-plus-circle</v-icon>
                                      </v-btn>
                                    </template>
                                    <span>Novo card</span>
                                  </v-tooltip>
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>

                          </v-list-item-content>
                        </v-list-item>
                      </v-card>
                    </div>
                  </v-card>
                </v-slide-group-item>
              </v-slide-group>
            </v-sheet>

            <div v-if="quadros === null && !loading" justify="center">
              <v-col cols="12" md="8" lg="6">
                <v-alert
                    :value="true"
                    type="info"
                    elevation="2"
                    icon="mdi-information"
                >
                  Nenhuma Lista encontrado.
                </v-alert>
              </v-col>
            </div>

          </v-col>
          <!-- </v-row> -->
        </v-row>
      </v-container>

      <!-- Tela de confirmação de exclusão de lista -->
      <v-dialog v-model="dialogExcluir" max-width="500px">
        <v-card>
          <v-card-title class="headline">Excluir quadro</v-card-title>
          <v-card-text>Tem certeza que deseja excluir a lista?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialogExcluir = false">Cancelar</v-btn>
            <v-btn color="red darken-1" text @click="excluirLista(listaEscolhida._id)">Excluir</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Tela de inclusão de lista no quadro -->
      <v-dialog v-model="dialogNovaLista" max-width="500px">
        <v-card>
          <v-card-title class="headline">Nova lista</v-card-title>
          <v-card-text>
            <v-text-field
                v-model="novaListaTitulo"
                label="Título da lista"
                outlined
                dense
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialogNovaLista = false, novaListaTitulo=''">Cancelar</v-btn>
            <v-btn color="green darken-1" text @click="criarLista()">Criar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Tela de inclusão de card na lista -->
      <v-dialog v-model="dialogNovoCard" max-width="500px">
        <v-card>
          <v-card-title class="headline">Novo card</v-card-title>
          <v-card-text>
            <v-text-field
                v-model="novoCardTitulo"
                label="Título do card"
                outlined
                dense
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialogNovoCard = false, novoCardTitulo=''">Cancelar</v-btn>
            <v-btn color="green darken-1" text @click="criarCard()">Criar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>


    </v-main>
  </v-container>

</template>

<script>

import axios from 'axios';
import Loading from 'vue-loading-overlay';

export default {
  data() {
    return {
      quadros: null,
      quadro:null,
      listas: [],
      usuarios: [],
      emailsSelecionados: [],
      usuarioEdita: false,
      edita: false,
      novaListaTitulo: "",
      novoCardTitulo:"",

      dialogExcluir: false,
      dialogCompartilhar: false,
      dialogNovaLista: false,
      dialogNovoCard: false,
      quadroEscolhido: null,
      listaEscolhida:null,

      lightenAmount: 0.3,
      error: "",
      loading: true,

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

  components: {
    Loading,
  },

  methods: {
    // Ajusta a cor de fundo de cada lista do quadro
    corAjustada: function(color) {

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


    // Retorna se o quadro é editável pelo usuário
    permiteEdicao: function(editaveis){
      var email = this.$root.credentials.email;

      if(editaveis.includes(email)){
        return true;

      }
      else{
        return false;
      }
    },

    // Recupera os quadros do usuário
    recuperaQuadros: function() {
      this.quadros = null;
      this.loading = true;
      axios.get(this.httpOptions.baseURL +'/quadros', this.httpOptions)
          .then(response => {
            var quadros = response.data.quadros;

            var requests = quadros.map(quadro =>
                axios.get(this.httpOptions.baseURL +'/listas/?idQuadro='+ quadro._id)
                    .then(response => {
                      quadro.listas = response.data.items;
                    })
            );

            return Promise.all(requests)
                .then(() => {
                  for (let i = 0; i <= quadros.length-1;i++){
                    if (quadros[i]._id == this.$router.currentRoute.params.id){
                      this.quadro = quadros[i];
                    }
                  }
                  this.quadros = quadros;
                  this.loading = false;
                });
          })
          .catch(error => {
            this.error = error;
          });
    },

    // recuperaQuadro: function() {
    //   this.quadro = null;
    //   this.loading = true;
    //   axios.get(this.httpOptions.baseURL +'/quadros/' + this.$router.currentRoute.params.id, this.httpOptions)
    //       .then(response => {
    //
    //         var quadro = response.data;
    //
    //         var requests = axios.get(this.httpOptions.baseURL +'/listas/?idQuadro='+ quadro._id)
    //             .then(response => {
    //                   quadro.listas = response.data.items;
    //                 }
    //             )
    //         console.log("FINAL",quadro);
    //
    //         return Promise.all(requests)
    //             .then(() => {
    //               this.quadro = quadro;
    //               this.loading = false;
    //             });
    //       })
    //       .catch(error => {
    //         this.error = error;
    //       });
    // },

    // Recupera os usuários cadastrados
    recuperaUsuarios: function() {
      axios.get(this.httpOptions.baseURL +'/usuarios')
          .then(response => {
            var dados = response.data.items;
            this.usuarios = dados.filter(usuario => usuario.email != this.$root.credentials.email);
          })
          .catch(error => {
            this.error = error;
          });
    },

    // Abre a janela de formulário para inclusão de lista
    abrirNovaLista: function(quadro) {
      this.quadroEscolhido = quadro;
      this.dialogNovaLista = true;
    },

    // Inclui uma nova lista no quadro
    criarLista: function() {
      var idQuadro = this.quadroEscolhido._id;
      var titulo = this.novaListaTitulo;

      axios.post(this.httpOptions.baseURL +'/listas', {
            idQuadro: idQuadro,
            titulo: titulo
          },
          this.httpOptions)
          .then(response => {
            this.quadroEscolhido.listas.push(response.data.item);
            this.novaListaTitulo = "";
            this.quadros = this.quadros.map(quadro => {
              if(quadro._id == idQuadro){
                quadro.listas = this.quadroEscolhido.listas;
              }
            });
            this.dialogNovaLista = false;
            this.recuperaQuadros();
          })
          .catch(error => {
            this.error = error;
          });
    },

    // Abre a janela de formulário para inclusão de card
    abrirNovoCard: function(lista) {
      this.listaEscolhida = lista;
      this.dialogNovoCard = true;
    },
    // Inclui um novo card na lista
    criarCard: function() {
      var idLista = this.listaEscolhida._id;
      var titulo = this.novoCardTitulo;

      axios.post(this.httpOptions.baseURL +'/cards', {
            idLista: idLista,
            titulo: titulo
          },
          this.httpOptions)
          .then(response => {
            this.listaEscolhida.cards.push(response.data.item);
            this.novoCardTitulo = "";
            this.quadro.listas = this.quadros.listas.map(lista => {
              if(lista._id == idLista){
                lista = this.listaEscolhida;
              }
            });
            this.dialogNovaLista = false;
            this.recuperaQuadros();
          })
          .catch(error => {
            this.error = error;
          });
    },


    // Acessa a página para editar uma lista
    editarLista: function(idLista) {
      this.$router.replace("/listas/"+ idLista)
    },

    // Acessa a página de detalhamento de uma lista
    detalharLista: function(idLista) {
      this.$router.replace("/listas/detalhar/"+ idLista)
    },

    // Abre a janela de confirmação para excluir o quadro
    abrirExcluir: function(lista) {
      this.listaEscolhida = lista;
      this.dialogExcluir = true;
    },

    // Exclui a lista
    excluirLista: function(idLista) {
      this.dialogExcluir = false;
      axios.delete(this.httpOptions.baseURL +'/listas/'+ idLista, this.httpOptions)
          .then(() => {
            this.listaEscolhida = null;
            this.recuperaQuadros();
          })
          .catch(error => {
            this.error = error
          });
    },
  },

  mounted() {
    this.recuperaQuadros();
    this.recuperaUsuarios();
  }
}
</script>
