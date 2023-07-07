<template>
  <v-container>
    <v-main class="bg-grey-lighten-3bg">
      <v-container>

        <v-row>
          <v-col cols="2">
            <v-sheet :rounded=true>
              <v-list :rounded=true>
                <v-list-item link @click="recuperaQuadros">
                  <v-list-item-title>
                    Meus quadros
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

          <v-col cols="10">
            <loading :active="loading" :is-full-page="true" />
            <v-row v-if="quadros.length > 0" justify="space-around">
              <v-col v-for="quadro in quadros" :key="quadro._id" cols="4">
                <v-sheet class="mx-auto" max-width="344" tile>
                  <v-row class="fill-height" align="center" justify="center">
                    <v-col cols="12">
                      <v-card class="mx-auto" max-width="500" elevation="15"
                        :style="{ backgroundColor: quadro.corFundo }">
                        <v-list-item>
                          <v-list-item-content>
                            <v-row>
                              <v-col cols="10" justify="space-between">
                                <v-hover v-slot="{ hover }">
                                  <v-list-item-title class="headline mb-1" :style="{ color: quadro.corTexto }">
                                    {{ quadro.titulo }}
                                    <v-expand-transition>
                                      <div v-if="hover" class="d-flex transition-fast-in-fast-out " style="height: 100%;">
                                        <v-tooltip bottom>
                                          <template v-slot:activator="{ on }">
                                            <v-btn
                                                icon
                                                v-on="on"
                                                color="success"
                                                @click="detalharQuadro(quadro._id)"
                                            >
                                              <v-icon>mdi-book-open</v-icon>
                                            </v-btn>
                                          </template>
                                          <span>Detalhar quadro</span>
                                        </v-tooltip>

                                        <v-tooltip bottom>
                                          <template v-slot:activator="{ on }">
                                            <v-btn icon v-on="on" color="warning" @click="editarQuadro(quadro._id)">
                                              <v-icon>mdi-pencil-circle</v-icon>
                                            </v-btn>
                                          </template>
                                          <span>Editar quadro</span>
                                        </v-tooltip>

                                        <v-tooltip bottom>
                                          <template v-slot:activator="{ on }">
                                            <v-btn icon v-on="on" color="error" @click="excluirQuadro(quadro._id)">
                                              <v-icon>mdi-delete-circle</v-icon>
                                            </v-btn>
                                          </template>
                                          <span>Excluir quadro</span>
                                        </v-tooltip>

                                        <v-tooltip bottom>
                                          <template v-slot:activator="{ on }">
                                            <v-btn icon v-on="on" color="success" @click="abrirCompartilhar(quadro._id)">
                                              <v-icon>mdi-share-circle</v-icon>
                                            </v-btn>
                                          </template>
                                          <span>Compartilhar quadro</span>
                                        </v-tooltip>
                                      </div>
                                    </v-expand-transition>

                                  </v-list-item-title>
                                </v-hover>
                              </v-col>

                              <v-icon v-if="!quadro.favorito" v-on:click="toggleFavorito(quadro._id, quadro.favorito)"
                                color="warning">mdi-star-outline</v-icon>
                              <v-icon v-if="quadro.favorito" v-on:click="toggleFavorito(quadro._id, quadro.favorito)"
                                color="warning">mdi-star</v-icon>
                            </v-row>

                            <v-list v-for="lista in quadro.listas" :key="lista"
                              :style="{ backgroundColor: corAjustada(quadro.corFundo) }">
                              <v-list-item>
                                <v-list-item-content>
                                  <v-list-item-title :style="{ color: quadro.corTexto }">{{ lista.titulo }}
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
          </v-col>
        </v-row>
      </v-container>
      <!-- Tela de confirmação de exclusão de quadro -->
      <v-dialog v-model="dialogExcluir" max-width="500px">
        <v-card>
          <v-card-title class="headline">Excluir quadro</v-card-title>
          <v-card-text>Tem certeza que deseja excluir o quadro?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialogExcluir = false">Cancelar</v-btn>
            <v-btn color="red darken-1" text @click="excluirQuadroConfirmado(quadroEscolhido)">Excluir</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Tela de compartilhamento de quadro -->
      <v-dialog v-model="dialogCompartilhar" max-width="500px">
        <v-card v-model="quadroEscolhido">
          <v-card-title class="headline">Compartilhar quadro</v-card-title>
          <v-card-text>
            <v-select v-model="emailsSelecionados" :items="usuarios" item-text="email" item-value="email" label="Usuário"
              outlined dense chips deletable-chips multiple></v-select>
          </v-card-text>
          <!-- Inserir a opção de torar o quadro editável ou não -->
          <v-col>
            <v-label class="text-left">Tornar quadro editável?</v-label>
            <v-radio-group v-model="quadroEscolhido.editavel" row>
              <v-radio label="Sim" value="true"></v-radio>
              <v-radio label="Não" value="false"></v-radio>
            </v-radio-group>
          </v-col>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialogCompartilhar = false">Cancelar</v-btn>
            <v-btn color="green darken-1" text @click="compartilharQuadro(quadroEscolhido)">Compartilhar</v-btn>
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
      listas: [],
      usuarios: [],
      emailsSelecionados: [], //

      dialogExcluir: false,
      dialogCompartilhar: false,
      quadroEscolhido: "",

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

    // Recupera os quadros do usuário
    recuperaQuadros: function () {
      this.quadros = null;
      this.loading = true;
      axios.get(this.httpOptions.baseURL + '/quadros', this.httpOptions)
        .then(response => {
          var quadros = response.data.quadros;

          var requests = quadros.map(quadro =>
            axios.get(this.httpOptions.baseURL + '/listas/?idQuadro=' + quadro._id)
              .then(response => {
                quadro.listas = response.data.items;
              })
          );

          return Promise.all(requests)
            .then(() => {
              this.quadros = quadros;
              this.loading = false;
            });
        })
        .catch(error => {
          console.error('Erro ao recuperar os quadros:', error);
        });
    },

    // Recupera os usuários cadastrados
    recuperaUsuarios: function () {
      axios.get(this.httpOptions.baseURL + '/usuarios')
        .then(response => {
          var dados = response.data.items;
          this.usuarios = dados.filter(usuario => usuario.email != this.$root.credentials.email);
        })
        .catch(error => {
          console.error('Erro ao recuperar os usuários:', error);
        });
    },

    // Altera o status de favorito do quadro
    toggleFavorito: function (idQuadro, favorito) {
      console.log("🚀 ~ file: HomeQuadros.vue:197 ~ idQuadro:", idQuadro)

      axios.put(this.httpOptions.baseURL + '/quadros/' + idQuadro, {
        favorito: !favorito
      },
        this.httpOptions)
        .then(() => {
          this.recuperaQuadros();
        })
        .catch(error => {
          console.error('Erro ao alterar o status de favorito do quadro:', error);
        });
    },

    novoQuadro: function () {
      this.$router.replace("/quadros/novo")
    },

    editarQuadro: function (idQuadro) {
      this.$router.replace("/quadros/editar/" + idQuadro)
    },

    detalharQuadro: function () {
      this.$router.replace("/quadros/detalhar/:id")
    }
  },

  mounted() {
    this.recuperaQuadros();
    this.recuperaUsuarios();
  }
}
</script>

<style>
/* Inserindo um estilo que tenha posição absoluta e o item aparece de cima pra baixo */
.v-btn--reveal {
  transition: all .3s cubic-bezier(.55, 0, .1, 1);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
