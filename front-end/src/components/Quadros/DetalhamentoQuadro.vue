<template>
  <v-container>
    <v-main class="bg-grey-lighten-3bg">
      <v-container>

        <v-row>
          <v-col cols="2">
            <v-sheet :rounded=true>
              <v-list :rounded=true>
                <v-list-item link @click="recuperaQuadro" >
                  <v-list-item-title>
                    Atualizar listas
                  </v-list-item-title>
                </v-list-item>

                <v-divider class="my-2"></v-divider>

                <v-list-item link color="grey-lighten-4" @click="abrirNovaLista(quadro)">
                  <v-list-item-title>
                    Criar nova Lista
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
                    name="slide-item-listas"
                >
                  <v-card
                      v-if="quadro.listas.length > 0"
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
                          :style="{ backgroundColor: this.quadro.corFundo}"
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
                                      :style="{ color: this.quadro.corTexto }"
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
                                                  color="warning"
                                                  @click="editarLista(lista._id)"
                                              >
                                                <v-icon>mdi-pencil-circle</v-icon>
                                              </v-btn>
                                            </template>
                                            <span>Editar Lista</span>
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

                            <v-list  v-for="card in lista.cards" :key="card"  :style="{ backgroundColor: corAjustada(this.quadro.corFundo) }">
                              <v-list-item>
                                <v-list-item-content>
                                  <v-list-item-title
                                      :style="{ color: this.quadro.corTexto }"
                                  >{{ card.titulo }}
                                  </v-list-item-title>
                                </v-list-item-content>
                              </v-list-item>
                            </v-list>

                          </v-list-item-content>
                        </v-list-item>
                      </v-card>
                    </div>
                  </v-card>
                </v-slide-group-item>
              </v-slide-group>
            </v-sheet>

            <div v-if="quadro.listas === null && !loading" justify="center">
              <v-col cols="12" md="8" lg="6">
                <v-alert
                    :value="true"
                    type="info"
                    elevation="2"
                    icon="mdi-information"
                >
                  Nenhuma lista encontrada.
                </v-alert>
              </v-col>
            </div>




          </v-col>
          <!-- </v-row> -->
        </v-row>
      </v-container>

      <!-- Tela de confirmação de exclusão de quadro -->
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


    </v-main>
  </v-container>

</template>

<script>

import axios from 'axios';
import Loading from 'vue-loading-overlay';

export default {
  data() {
    return {
      quadro: null,
      listas: [],
      usuarios: [],
      emailsSelecionados: [],
      usuarioEdita: false,
      edita: false,
      favorito: false,
      novaListaTitulo: "",

      dialogExcluir: false,
      dialogCompartilhar: false,
      dialogNovaLista: false,
      quadroEscolhido: null,
      listaEscolhida: null,

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


    // Recupera o quadros do usuário
    recuperaQuadro: function() {
      this.quadro = null;
      this.loading = true;
      //Tem que passar aqui o parametro da url
      axios.get(this.httpOptions.baseURL +'/quadros/' + , this.httpOptions)
          .then(response => {
            var quadro = response.data.quadro;

            var requests = quadros.map(quadro =>
                axios.get(this.httpOptions.baseURL +'/listas/?idQuadro='+ quadro._id)
                    .then(response => {
                      quadro.listas = response.data.items;
                    })
            );

            return Promise.all(requests)
                .then(() => {
                  this.quadro = quadro;
                  this.loading = false;
                });
          })
          .catch(error => {
            this.error = error;
          });
    },

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

    // Acessa a página para editar um quadro
    editarQuadro: function(idQuadro) {
      this.$router.replace("/quadros/"+ idQuadro)
    },


    // Abre a janela de confirmação para excluir o quadro
    abrirExcluir: function(lista) {
      this.listaEscolhido = lista;
      this.dialogExcluir = true;
    },

    // Exclui a lista
    excluirLista: function(idLista) {
      this.dialogExcluir = false;
      axios.delete(this.httpOptions.baseURL +'/listas/'+ idLista, this.httpOptions)
          .then(() => {
            this.quadroEscolhido = null;
            this.recuperaQuadros();
          })
          .catch(error => {
            this.error = error
          });
    },
  },

  mounted() {
    this.recuperaQuadro();
    this.recuperaUsuarios();
  }
}
</script>