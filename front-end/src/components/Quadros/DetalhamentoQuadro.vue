<template>
  <v-main>
    <v-container>
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
                        <v-card-title class="headline" :style="{ color: quadro.corTexto }">{{ lista.titulo }}</v-card-title>
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

        <!-- Exibindo um v-dialog para editar e excluir um card de uma lista -->
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ listaEditada === null ? "" : listaEditada.titulo }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="12">
                    <v-textarea v-model="cardEditado.conteudo" label="Conteúdo"></v-textarea>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <!-- Inserindo uma opção de colocar o card em outra lista e exibindo as listas possíveis -->
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
              <v-btn color="blue darken-1" text @click="dialog = false">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="atualizaCard">Salvar</v-btn>
              <v-btn color="error" text @click="deleteItem">Excluir</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-sheet>      
    </v-container>
  </v-main>
</template>

<script>
  import axios from 'axios';

  export default {
    
    data() {
        return {

          headers: [
            ],
            
            dialog: false,
            listaEditada: null,
            cardEditado: null || "",
            loading: false,
        
            trocaLista: false,
            listaNova: null,
            quadro: null,
            listas: [],
            listasDiferentes: [],

            menuFundo: false,
            menuTexto: false,
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

        // Abre a caixa de diálogo para editar um card
        editItem(lista, card) {
            this.listaEditada = lista;
            this.cardEditado = card;
            this.listasDiferentes = this.listas.filter((listaAtual) => listaAtual !== lista);
            console.log("🚀 ~ file: DetalhamentoQuadro.vue:165 ~ editItem ~ this.listasDiferentes:", this.listasDiferentes)
            this.dialog = true;
        },

        // Salva as alterações feitas em uma lista
        atualizaCard: function () {
            this.loading = true;
            var idLista = this.listaEditada._id;
            console.log("🚀 ~ file: DetalhamentoQuadro.vue:172 ~ card:", this.cardEditado)

            console.log("🚀 ~ file: DetalhamentoQuadro.vue:177 ~ idLista:", idLista)
            
            if (this.trocaLista) {
                axios.put(this.httpOptions.baseURL + '/listas/' + this.listaNova + '/card', this.cardEditado)
                .then(() => {
                    axios.delete(this.httpOptions.baseURL + '/listas/' + idLista + '/card/', this.cardEditado)
                    .then(() => {
                            this.loading = false;
                            this.dialog = false;
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
                    this.loading = false;
                    this.dialog = false;
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
                    console.log("🚀 ~ file: DetalhamentoQuadro.vue:93 ~ response:", response)
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
                    this.preencheHeader();
                    this.preencheCards(response.data.cards);
                    this.loading = false;
                })
                .catch(error => {
                    this.error = error;
                    this.loading = false;
                });
        },

        // função para preencher o this.cards com um array de objetos que contém os cards de cada lista
        preencheCards: function (respostaApi) {
            for (const objeto of respostaApi) {
                const { idLista, cards } = objeto;

                for (const itemCard of cards) {
                    const { conteudo } = itemCard;
                    const novoObjeto = {
                    [idLista]: conteudo,
                    };
                    this.cards.push(novoObjeto);
                }
            }
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
