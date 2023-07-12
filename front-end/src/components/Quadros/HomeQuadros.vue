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
                    Atualizar quadros
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

            <!-- Tela de carregamento e barra de erro -->
            <v-row justify="center">
              <loading :active.sync="loading" :can-cancel="false" :is-full-page="true"
                :color="this.$root.config.corSecundaria" :loader="'dots'"></loading>
            </v-row>
            <p class="error pa-1 mb-8" v-if="error">{{ error }}</p>


            <v-show v-if="!loading && quadros.length > 0">
              <v-sheet class="mx-auto" elevation="8" max-width="100%">
                <v-slide-group show-arrows class="pa-4" name="slide-group-quadros">
                  <v-slide-group-item v-for="quadro in quadros" :key="quadro._id" name="slide-item-quadros">
                    <v-card color="grey-lighten-1" :class="['ma-4']" max-height="100%" width="344">
                      <div class=" fill-height justify-center">
                        <v-card class="mx-auto" width="344" elevation="15" :style="{ backgroundColor: quadro.corFundo }">
                          <v-list-item>
                            <v-list-item-content>
                              <v-row>
                                <v-col cols="10" justify="space-between">
                                  <v-hover v-slot="{ hover }">
                                    <v-list-item-title class="headline mb-1" :style="{ color: quadro.corTexto }">
                                      <v-btn :style="{ backgroundColor: corAjustada(quadro.corFundo) }" icon @click="toggleFavorito(quadro)">
                                        <v-icon :color="emailFavorito(quadro) ? 'yellow' : 'darken grey'">
                                          mdi-star
                                        </v-icon>
                                      </v-btn>

                                      {{ quadro.titulo }}

                                      <v-expand-transition>
                                        <div v-if="hover"
                                          class="d-flex transition-fast-in-fast-out"
                                          :style="{ marginTop: '2%'}"
                                        >

                                          <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                              <v-btn icon v-on="on" :style="{ backgroundColor: corAjustada(quadro.corFundo) }" @click="detalharQuadro(quadro._id)">
                                                <v-icon :color="black" >mdi-eye-circle</v-icon>
                                              </v-btn>
                                            </template>
                                            <span>Detalhar quadro</span>
                                          </v-tooltip>

                                          <v-show v-if="permiteEdicao(quadro.editavel)">
                                            <v-tooltip bottom>
                                              <template v-slot:activator="{ on }">
                                                <v-btn icon v-on="on" :style="{ backgroundColor: corAjustada(quadro.corFundo) }" @click="editarQuadro(quadro._id)">
                                                  <v-icon color="warning">mdi-pencil-circle</v-icon>
                                                </v-btn>
                                              </template>
                                              <span>Editar quadro</span>
                                            </v-tooltip>

                                            <v-tooltip bottom>
                                              <template v-slot:activator="{ on }">
                                                <v-btn icon v-on="on" :style="{ backgroundColor: corAjustada(quadro.corFundo) }" @click="abrirExcluir(quadro)">
                                                  <v-icon color="error">mdi-delete-circle</v-icon>
                                                </v-btn>
                                              </template>
                                              <span>Excluir quadro</span>
                                            </v-tooltip>
                                          </v-show>

                                          <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                              <v-btn icon v-on="on" :style="{ backgroundColor: corAjustada(quadro.corFundo) }"
                                                @click="abrirCompartilhar(quadro)">
                                                <v-icon  color="success">mdi-share-circle</v-icon>
                                              </v-btn>
                                            </template>
                                            <span>Compartilhar quadro</span>
                                          </v-tooltip>
                                        </div>
                                      </v-expand-transition>

                                    </v-list-item-title>
                                  </v-hover>
                                </v-col>

                                <v-col justify="space-between">

                                </v-col>

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

                              <v-list-item>
                                <v-list-item-content>
                                  <v-list-item-title>
                                    <v-tooltip bottom>
                                      <template v-slot:activator="{ on }">
                                        <v-btn icon v-if="permiteEdicao(quadro.editavel)" v-on="on"
                                          :style="{ color: quadro.corTexto }" @click="abrirNovaLista(quadro)">
                                          <v-icon>mdi-plus-circle</v-icon>
                                        </v-btn>
                                      </template>
                                      <span>Nova lista</span>
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
            </v-show>

            <!-- Caso contrário exibe mensagem que não há quadros cadastrados -->
            <v-show v-if="!loading && quadros.length == 0">
              <v-row justify="center">
                <v-col cols="12" md="8" lg="6">
                  <v-alert :value="true" type="info" elevation="2" icon="mdi-information">
                    Nenhum quadro encontrado.
                  </v-alert>
                </v-col>
              </v-row>
            </v-show>
          </v-col>
          <!-- </v-row> -->
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
            <v-btn color="red darken-1" text @click="excluirQuadro(quadroEscolhido._id)">Excluir</v-btn>
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

          <v-col>
            <v-show v-if="usuarioEdita">
              <v-label class="text-left">Tornar quadro editável?</v-label>
              <v-radio-group v-model="edita" row>
                <v-radio label="Sim" value="true"></v-radio>
                <v-radio label="Não" value="false"></v-radio>
              </v-radio-group>
            </v-show>
          </v-col>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text
              @click="dialogCompartilhar = false, emailsSelecionados = []">Cancelar</v-btn>
            <v-btn color="green darken-1" text @click="compartilharQuadro()">Compartilhar</v-btn>
          </v-card-actions>
          <v-alert v-if="sucesso" type="success">
            Compartilhamento realizado com sucesso!
          </v-alert>
        </v-card>
      </v-dialog>

      <!-- Tela de inclusão de lista no quadro -->
      <v-dialog v-model="dialogNovaLista" max-width="500px">
        <v-card>
          <v-card-title class="headline">Nova lista</v-card-title>
          <v-card-text>
            <v-text-field v-model="novaListaTitulo" label="Título da lista" outlined dense></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialogNovaLista = false, novaListaTitulo = ''">Cancelar</v-btn>
            <v-btn color="green darken-1" text @click="criarLista()" :disabled="!novaListaTitulo">Criar</v-btn>
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
      emailsSelecionados: [],
      usuarioEdita: false,
      edita: false,
      favorito: false,
      novaListaTitulo: "",
      sucesso: false,

      dialogExcluir: false,
      dialogCompartilhar: false,
      dialogNovaLista: false,
      quadroEscolhido: null,

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

    // Retorna se o quadro é favorito do usuário
    emailFavorito: function (quadro) {
      var email = this.$root.credentials.email;

      if (quadro.favorito.includes(email)) {
        return true;
      }
      else {
        return false;
      }
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

    // Recupera os quadros do usuário
    recuperaQuadros: function () {
      this.quadros = null;
      this.error = "";
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
          this.error = error;
        });
    },

    // Recupera os usuários cadastrados
    recuperaUsuarios: function (listaDeAcesso) {
      axios.get(this.httpOptions.baseURL + '/usuarios')
        .then(response => {
          var dados = response.data.items;
          this.usuarios = dados.filter(usuario => !listaDeAcesso.includes(usuario.email));
        })
        .catch(error => {
          this.error = error;
        });
    },

    // Altera o status de favorito do quadro
    toggleFavorito: function (quadro) {
      var emailUsuario = this.$root.credentials.email;

      if (quadro.favorito.includes(emailUsuario)) {
        quadro.favorito = quadro.favorito.filter(email => email != emailUsuario);
      }
      else {
        quadro.favorito.push(emailUsuario);
      }

      console.log("🚀 ~ file: HomeQuadros.vue:144 ~ favoritos", quadro.favorito)
      axios.put(this.httpOptions.baseURL + '/quadros/' + quadro._id, {
        favorito: quadro.favorito
      },
        this.httpOptions)
        .then(() => {
        })
        .catch(error => {
          this.error = error;
        });
    },

    // Abre a janela de formulário para inclusão de lista
    abrirNovaLista: function (quadro) {
      this.quadroEscolhido = quadro;
      this.dialogNovaLista = true;
    },

    // Inclui uma nova lista no quadro
    criarLista: function () {
      var idQuadro = this.quadroEscolhido._id;
      var titulo = this.novaListaTitulo;

      axios.post(this.httpOptions.baseURL + '/listas', {
        idQuadro: idQuadro,
        titulo: titulo
      },
        this.httpOptions)
        .then(response => {
          this.quadroEscolhido.listas.push(response.data.item);
          this.novaListaTitulo = "";
          this.quadros = this.quadros.map(quadro => {
            if (quadro._id == idQuadro) {
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

    // Acessa a página de um novo quadro
    novoQuadro: function () {
      this.$router.replace("/quadros/novo")
    },

    // Acessa a página para editar um quadro
    editarQuadro: function (idQuadro) {
      this.$router.replace("/quadros/editar/" + idQuadro)
    },

    // Acessa a página de detalhamento de um quadro
    detalharQuadro: function (idQuadro) {
      this.$router.replace("/quadros/detalhar/" + idQuadro)
    },

    //função para direcionar o botão de compartilhar
    // compartilharQuadro: function (idQuadro) {
    //   this.$router.replace("/quadros/compartilhar/" + idQuadro)
    // },

    // Abre a janela de formulário para compartilhar o quadro
    abrirCompartilhar: function (quadro) {
      console.log("🚀 ~ file: HomeQuadros.vue:397 ~ quadro:", quadro)
      this.usuariosSelecionados = [];
      this.quadroEscolhido = quadro;
      var email = this.$root.credentials.email;
      this.recuperaUsuarios(quadro.acesso);
      this.usuarioEdita = this.quadroEscolhido.editavel.includes(email);
      this.dialogCompartilhar = true;
    },

    // Compartilha o quadro com outro usuário
    compartilharQuadro: function () {
      
      axios.post(this.httpOptions.baseURL + '/usuarios/compartilhar/' + this.quadroEscolhido._id, {
        emails: this.emailsSelecionados
      },
        this.httpOptions)
        .then(() => {
          this.quadroEscolhido = null;
          this.dialogCompartilhar = false;
          this.recuperaQuadros();
          this.sucesso = true;
          this.$router.replace("/quadros/");
        })
        .catch(error => {
          this.dialogCompartilhar = false;
          this.error = error.response.data.erro;
        });
    },

    // Abre a janela de confirmação para excluir o quadro
    abrirExcluir: function (quadro) {
      this.quadroEscolhido = quadro;
      this.dialogExcluir = true;
    },

    // Exclui o quadro
    excluirQuadro: function (idQuadro) {
      this.dialogExcluir = false;
      axios.delete(this.httpOptions.baseURL + '/quadros/' + idQuadro, this.httpOptions)
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
    this.recuperaQuadros();
    // this.recuperaUsuarios();
  }
}
</script>