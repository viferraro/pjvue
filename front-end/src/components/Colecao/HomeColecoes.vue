<template>
  <v-container>
    <v-main class="bg-grey-lighten-3bg">
      <v-container>


        <v-row>
          <v-col cols="3">
            <v-sheet :rounded=true>
              <v-list :rounded=true>
                <v-list-item link @click="recuperaColecoes">
                  <v-list-item-title>
                    Atualizar coleções
                  </v-list-item-title>
                </v-list-item>

                <v-divider class="my-2"></v-divider>

                <v-list-item link color="grey-lighten-4" @click="abrirNovaColecao">
                  <v-list-item-title>
                    Criar nova coleção
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-col>

          <v-row justify="center">
            <loading :active="loading" :is-full-page="true" />
          </v-row>

          <!-- Inserindo um v-card que tem v-cards com um v-for -->
          <v-row v-for="colecao in colecoes" :key="colecao.id">
            <v-col cols="12">
              <v-card>
                <v-card-title>
                  <v-list-item-title>{{ colecao.nome }}</v-list-item-title>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn icon v-on="on" @click="abrirExcluirColecao(colecao)">
                        <v-icon color="error">mdi-delete-circle</v-icon>
                      </v-btn>
                    </template>
                    <span>Excluir coleção</span>
                  </v-tooltip>

                </v-card-title>

                <v-card v-for="quadro in colecao.quadros" :key="quadro.id">
                  <v-card-title>
                    <v-list-item-title>{{ quadro.nome }}</v-list-item-title>
                  </v-card-title>
                </v-card>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on" @click="abrirAdicionaQuadros(colecao)">
                      <v-icon color="success">mdi-plus-circle</v-icon>
                    </v-btn>
                  </template>
                  <span>Adicionar quadros</span>
                </v-tooltip>

              </v-card>
            </v-col>
          </v-row>
        </v-row>

        <!-- Inserindo uma v-dialog para criar uma nova coleção -->
        <v-dialog v-model="dialogNovaColecao" max-width="500px">
          <v-card>
            <v-card-title class="headline">Nova Coleção</v-card-title>
            <v-card-text>
              <v-text-field v-model="novaColecaoTitulo" label="Título da coleção" outlined dense></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text
                @click="dialogNovaColecao = false, novaColecaoTitulo = ''">Cancelar</v-btn>
              <v-btn color="green darken-1" text @click="criaColecao()" :disabled="!novaColecaoTitulo">Criar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Tela para excluir coleção -->
        <v-dialog v-model="dialogConfirmaExclusaoColecao" max-width="500px">
          <v-card>
            <v-card-title class="headline">Excluir quadro</v-card-title>
            <v-card-text>Tem certeza que deseja excluir o quadro?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialogConfirmaExclusaoColecao = false">Cancelar</v-btn>
              <v-btn color="red darken-1" text @click="excluirColecao()">Excluir</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-container>
    </v-main>
  </v-container>
</template>

<script>

import axios from 'axios';
import Loading from 'vue-loading-overlay';

export default {
  data() {
    return {
      colecoes: [],
      quadros: [],
      colecaoEditada: null,
      novaColecaoTitulo: "",

      dialogNovaColecao: false,
      dialogAdicionaQuadros: false,
      dialogConfirmaExclusaoColecao: false,

      lightenAmount: 0.3,
      error: "",
      loading: false,

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
    Loading
  },

  methods: {
    // corAjustada(color) {
    //   var amount = this.lightenAmount;
    //   // Remove o caractere '#' da cor hexadecimal
    //   const hexColor = color.replace('#', '');

    //   // Converte a cor hexadecimal para os valores de RGB
    //   const red = parseInt(hexColor.substr(0, 2), 16);
    //   const green = parseInt(hexColor.substr(2, 2), 16);
    //   const blue = parseInt(hexColor.substr(4, 2), 16);

    //   // Calcula a cor clareada com base no valor fornecido
    //   const lightenedRed = Math.round(red + (255 - red) * amount);
    //   const lightenedGreen = Math.round(green + (255 - green) * amount);
    //   const lightenedBlue = Math.round(blue + (255 - blue) * amount);

    //   // Converte os valores de RGB de volta para a cor hexadecimal
    //   const lightenedHex = '#' +
    //     lightenedRed.toString(16).padStart(2, '0') +
    //     lightenedGreen.toString(16).padStart(2, '0') +
    //     lightenedBlue.toString(16).padStart(2, '0');

    //   // Retorna a cor clareada no formato hexadecimal
    //   return lightenedHex;
    // },

    // funcção para abrir a caixa de diálogo para incluir quadros na coleção
    abrirAdicionaQuadros: function (colecao) {
      this.colecaoEditada = colecao;
      this.dialogAdicionaQuadros = true;
    },

    // função para criar uma coleção
    criaColecao: function () {
      this.dialogNovaColecao = false;

      axios.post(this.httpOptions.baseURL + '/colecoes/', {
        titulo: this.novaColecaoTitulo,
      }, this.httpOptions)
        .then(() => {
          this.error = ""
          this.recuperaColecoes();
        })
        .catch((error) => {
          this.error = error.response.data.message
        })
    },

    //função para recuperar as coleções do usuário logado
    recuperaColecoes: function () {
      this.colecoes = null;
      this.loading = true;
      axios.get(this.httpOptions.baseURL + '/colecoes', this.httpOptions)
        .then(response => {
          var colecoes = response.data.colecoes;
          this.colecoes = colecoes;
          this.loading = false;
        })
        .catch(error => {
          console.error('Erro ao recuperar as colecoes:', error);
        });
    },

    //função para excluir uma coleção
    excluirColecao: function () {
      this.loading = true;
      var colecao = this.colecaoEditada._id;
      axios.delete(this.httpOptions.baseURL + '/colecoes/' + colecao, this.httpOptions)
        .then(() => {
          this.recuperaColecoes();
          this.dialogConfirmaExclusaoColecao = false;
        })
        .catch(error => {
          console.error('Erro ao excluir a coleção:', error);
        });
    },

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

    abrirNovaColecao: function () {
      this.dialogNovaColecao = true;
    },

    abrirExcluirColecao: function (colecao) {
      this.colecaoEditada = colecao;
      this.dialogConfirmaExclusaoColecao = true;
    },


  },



  mounted() {
    this.recuperaColecoes();
    this.recuperaUsuarios();
  }
}
</script>

