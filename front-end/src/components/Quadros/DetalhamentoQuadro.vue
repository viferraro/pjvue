<template>
  
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
      quadro: null,
      listaArray:[],

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

    // Recupera o quadro
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
      for (let i = 0; i < this.quadros.length-1; i++) {
        if (this.$route.params.idQuadro == this.quadros[i]._id.toString()){
          this.quadro = this.quadros[i];
          this.listaArray = this.quadro[i].listas;
        }
      }
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

    novaLista: function () {
      this.$router.replace("/quadro/lista/nova")
    },

    editarLista: function (idLista) {
      this.$router.replace("/quadros/lista/editar" + idLista)
    },

    detalharLista: function (idLista) {
      this.$router.replace("/quadros/lista/detalhar/" + idLista)
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
