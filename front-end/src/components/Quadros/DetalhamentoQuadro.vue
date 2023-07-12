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
        <v-sheet class="mx-auto" elevation="8" width="fit-content" :style="{ backgroundColor: quadro.corFundo, paddingLeft:'1%', paddingRight:'1%' }" justify="left">
          <!-- TODO: Melhorar o estilo do nome do quadro -->
          <v-label class="text-h3" :style="{ color: quadro.corTexto }">{{ quadro.titulo }}</v-label>
        </v-sheet>   
        
          <v-sheet class="mx-auto" elevation="8" max-width="100%" :style="{ backgroundColor: quadro.corFundo }">

            <v-btn
              v-if="permiteEdicao(quadro.editavel)"
              type="submit"
              class="primary"
              @click="abrirNovaLista"
              align="right"
              :style="{ marginLeft: '1%', marginTop: '1%' }"
            >
              Nova lista
            </v-btn>

            <v-slide-group show-arrows class="pa-4" name="slide-group-listas">
              <v-slide-group-item v-for="lista in listas" :key="lista._id" name="slide-item-listas">
                <v-card color="grey-lighten-1" :class="['ma-4']" max-height="100%" width="400">
                  <div class=" fill-height justify-center">
                        <v-card class="mx-auto" width="400" elevation="15" :style="{ backgroundColor: quadro.corFundo }">
                          
                              <v-sheet justify="space-between" align="center" :style="{ backgroundColor: corAjustada(quadro.corFundo), padding:'2%' }">
                                <v-label class="text-h6" :style="{ color: quadro.corTexto }">{{ lista.titulo }}</v-label>
                              </v-sheet>
                              <v-show v-if="permiteEdicao(quadro.editavel)" >

                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on }">
                                    <v-btn icon v-on="on" :style="{ backgroundColor: corAjustada(quadro.corFundo) }" @click="abrirAdicionarCard(lista)">
                                      <v-icon color="success">mdi-plus-circle</v-icon>
                                    </v-btn>
                                  </template>
                                  <span>Adicionar card</span>
                                </v-tooltip>

                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on }">
                                    <v-btn icon v-on="on" :style="{ backgroundColor: corAjustada(quadro.corFundo) }" @click="abrirEditarLista(lista)">
                                      <v-icon color="warning">mdi-pencil-circle</v-icon>
                                    </v-btn>
                                  </template>
                                  <span>Editar lista</span>
                                </v-tooltip>

                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on }">
                                    <v-btn icon v-on="on" :style="{ backgroundColor: corAjustada(quadro.corFundo) }" @click="abrirExcluirLista(lista)">
                                      <v-icon color="error">mdi-delete-circle</v-icon>
                                    </v-btn>
                                  </template>
                                  <span>Excluir lista</span>
                                </v-tooltip>
                              </v-show>

                            <v-list v-for="card in lista.cards" :key="card" :style="{ backgroundColor: quadro.corFundo, marginLeft: '5%', marginRight: '5%' }"
                                >
                                    <v-card  :style="{ backgroundColor: corAjustada(quadro.corFundo) }" class="mx-auto" width="400" elevation="15">
                                        <v-card-text  class="text-h7 multiline" :style="{ color: quadro.corTexto }">
                                          {{ card.conteudo }}
                                        </v-card-text>

                                        <v-card-actions>
                                            <v-tooltip bottom>
                                              <template v-slot:activator="{ on }">
                                                <v-btn icon v-on="on" @click="abrirEditarCard(lista, card)">
                                                  <v-icon color="warning">mdi-pencil-circle</v-icon>
                                                </v-btn>
                                              </template>
                                              <span>Editar card</span>
                                            </v-tooltip>         

                                            <v-spacer></v-spacer>

                                            <v-tooltip v-if="card.arquivoSalvo === ''" bottom>
                                              <template v-slot:activator="{ on }">
                                                <v-btn icon v-on="on" @click="abrirInputArquivo(lista, card)">
                                                  <v-icon color="darken grey">mdi-attachment</v-icon>
                                                </v-btn>
                                              </template>
                                              <span>Adicionar arquivo</span>                                            
                                            </v-tooltip>

                                            <v-tooltip v-if="card.arquivoSalvo !== ''" bottom>
                                              <template v-slot:activator="{ on }">
                                                <v-btn icon v-on="on" @click="abrirArquivo(lista, card)">
                                                  <v-icon color="success">mdi-attachment</v-icon>
                                                </v-btn>
                                              </template>
                                              <span>Abrir arquivo</span>
                                            </v-tooltip>
                                            
                                        </v-card-actions>
                                      </v-card>
                            </v-list>

                        </v-card>
                  </div>
                </v-card>
              </v-slide-group-item>
            </v-slide-group>           
          </v-sheet>   
        </v-show>   

        <!-- Exibindo uma caixa de diálogo para adicionar uma lista -->
        <v-dialog v-model="dialogNovaLista" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Nova lista</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="12">
                    <v-text-field v-model="novoTituloLista" label="Título"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialogNovaLista = false, resetarVariaveis">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="adicionaLista" :disabled="!novoTituloLista">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Exibindo uma caixa de diálogo para editar uma lista -->
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

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialogLista = false, resetarVariaveis">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="atualizaLista">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Exibindo uma caixa de diálogo para confimar a exclusão de uma lista -->
        <v-dialog v-model="dialogExcluiLista" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ listaEditada === null ? "" : listaEditada.titulo }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="12">
                    <v-label>Tem certeza que deseja excluir esta lista?</v-label>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialogExcluiLista = false, resetarVariaveis">Cancelar</v-btn>
              <v-btn color="error" text @click="excluirLista">Excluir</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Exibindo uma caixa de diálogo para adicionar um card em uma lista -->
        <v-dialog v-model="dialogNovoCard" max-width="500px">
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

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialogNovoCard = false, resetarVariaveis">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="criaCard" :disabled="!conteudoNovo">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Exibindo uma caixa de diálogo para editar e excluir um card de uma lista -->
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
                        <v-radio-group v-model="trocaLista" row mandatory>
                          <v-radio label="Não" value="false"></v-radio>
                          <v-radio label="Sim" value="true"></v-radio>
                          </v-radio-group>
                    </v-col>

                    <v-show v-if="trocaLista === 'true'">
                      <v-col cols="12" sm="12" md="8">
                        <v-select
                          v-model="listaNova"
                          :items="listasDiferentes"
                          label="Lista"
                          item-text="titulo"
                          item-value="_id"
                        ></v-select>
                      </v-col>
                    </v-show>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialogCard = false, resetarVariaveis">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="atualizaCard">Salvar</v-btn>
              <v-btn color="error" text @click="abrirExcluirCard">Excluir</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Exibindo uma caixa de diálogo para confimar a exclusão de um card -->
        <v-dialog v-model="dialogExcluiCard" max-width="300px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ listaEditada === null ? "" : listaEditada.titulo }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="12">
                    <v-label>Tem certeza que deseja excluir este card?</v-label>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialogExcluiCard = false">Cancelar</v-btn>
              <v-btn color="error" text @click="excluiCard">Excluir</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Exibindo uma caixa de diálogo para incluir um pdf -->
        <v-dialog v-model="dialogInputArquivo" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Incluir PDF</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="12">
                    <v-file-input
                      v-model="arquivo"
                      label="Arquivo"
                      accept="application/pdf"
                      prepend-icon="mdi-paperclip"
                      placeholder="Selecione um arquivo"
                      outlined
                      @change="arquivoAlterado"
                    ></v-file-input>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialogInputArquivo = false, resetarVariaveis">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="uploadArquivo()">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Exibindo uma caixa de diálogo para exibir um pdf -->
        <v-dialog v-model="dialogExibirArquivo" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Exibir PDF</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="12">
                    <object :data="cardEditado.conteudo" type="application/pdf" width="100%" height="500px">
                      <p>Seu navegador não tem um plugin para PDF. Você pode <a :href="cardEditado.conteudo">clicar aqui para baixar o PDF</a>.</p>
                    </object>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialogExibirArquivo = false">Fechar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>



    </v-container>
  </v-main>
</template>

<script>
  import axios from 'axios';
  import Loading from 'vue-loading-overlay';

  export default {
    
    data() {
        return {

            loading: true,
            menuFundo: false,
            menuTexto: false,
            lightenAmount: 0.3,
            
            dialogLista: false,
            dialogNovaLista: false,
            dialogCard: false,
            dialogNovoCard: false,
            dialogExcluiLista: false,
            dialogExcluiCard: false,
            dialogInputArquivo: false,
            dialogExibirArquivo: false,
            
            listaEditada: null,
            novoTituloLista: "",
            cardEditado: null || "",
            adicionaCard: true,
            conteudoNovo: "",
            arquivo: null,
        
            trocaLista: false,
            listaNova: "",
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

        // Reseta o valor default das variáveis
        resetarVariaveis: function () {
            this.listaEditada = null;
            this.cardEditado = null;
            this.trocaLista = false;
            this.listaNova = null;
            this.listasDiferentes = [];
            this.novoTitulo = "";
            this.adicionaCard = true;
            this.conteudoNovo = "";
            this.novoTituloLista = "";
            this.arquivo = null;
        },

        arquivoAlterado: function (event) {
          this.arquivo = event.target.files[0];
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

        //
        // MÉTODOS PARA MANIPULAR AS LISTAS
        //

        // Abre a caixa de diálogo para criar uma lista
        abrirNovaLista: function () {
            this.dialogNovaLista = true;
        },

        // Cria uma nova lista
        adicionaLista: function () {
            this.loading = true;
            this.dialogNovaLista = false;
            axios.post(this.httpOptions.baseURL + '/listas', {
                titulo: this.novoTituloLista,
                idQuadro: this.quadro._id
            })
            .then(() => {
                this.recuperaListas();
                this.resetarVariaveis();
                this.loading = false;
            })
            .catch((error) => {
              this.loading = false;
              this.error = error;
            });
        },

        // Abre a caixa de diálogo para editar uma lista
        abrirEditarLista: function(lista) {
            this.listaEditada = lista;
            this.dialogLista = true;
            this.novoTitulo = lista.titulo;
        },

        // Atualiza a lista editada
        atualizaLista: function(){
            this.loading = true;
            var lista = this.listaEditada;
            
            axios.put(this.httpOptions.baseURL + '/listas/' + lista._id, {
              titulo: this.novoTitulo 
            })
            .then(() => {
                this.dialogLista = false;
                this.recuperaListas();
                this.resetarVariaveis();
            })
            .catch((error) => {
                this.loading = false;
                this.error = error;
                console.log(error);
            });
        },

        // Abre a caixa de diálogo para excluir uma lista
        abrirExcluirLista: function(lista) {
            this.listaEditada = lista;
            this.dialogExcluiLista = true;
        },

        // Exclui a lista editada
        excluirLista: function(){
          var lista = this.listaEditada;
          this.loading = true;
          this.dialogExcluiLista = false;
          
          axios.delete(this.httpOptions.baseURL + '/listas/' + lista._id)
          .then(() => {
              this.recuperaListas();
              this.resetarVariaveis();
            })
            .catch((error) => {
              this.loading = false;
              this.error = error;
            });
        },

        //
        // MÉTODOS PARA MANIPULAR OS CARDS
        //

        // Abre a caixa de diálogo para criar um card
        abrirAdicionarCard: function (lista) {
            this.listaEditada = lista;
            this.dialogNovoCard = true;
        },

        // Cria um novo card
        criaCard: function () {
            this.dialogNovoCard = false;
            this.loading = true;
            
            axios.put(this.httpOptions.baseURL + '/listas/' + this.listaEditada._id + '/card', {
                conteudo: this.conteudoNovo
            })
            .then(() => {
                this.recuperaListas();
                this.resetarVariaveis();
                this.loading = false;
            })
            .catch((error) => {
              this.loading = false;
              this.error = error;
            });
        },

        // Abre a caixa de diálogo para editar um card
        abrirEditarCard: function(lista, card) {
            this.listaEditada = lista;
            this.cardEditado = card;
            this.conteudoNovo = card.conteudo;
            this.listasDiferentes = this.listas.filter((listaAtual) => listaAtual !== lista);
            this.dialogCard = true;
        },

        // Salva as alterações feitas no card
        atualizaCard: function () {
            this.loading = true;
            this.dialogCard = false;

            var idLista = this.listaEditada._id;
            var card = this.cardEditado;

            card.conteudo = this.conteudoNovo;

            if (this.listaNova !== "") {
              axios.put(this.httpOptions.baseURL + '/listas/' + this.listaNova + '/card', card)
              .then(() => {
                    axios.delete(this.httpOptions.baseURL + '/listas/' + idLista + '/card/' + card._id)
                    .then(() => {                      
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

        // Abre a caixa de diálogo para confirmar exclusão de um card
        abrirExcluirCard: function() {
            this.dialogExcluiCard = true;
        },

        // Exclui o card editado
        excluiCard: function () {
            this.loading = true;
            this.dialogExcluiCard = false;
            this.dialogCard = false;

            var idLista = this.listaEditada._id;
            var card = this.cardEditado;
            
            axios.delete(this.httpOptions.baseURL + '/listas/' + idLista + '/card/' + card._id)
                .then(() => {
                    this.resetarVariaveis();
                    this.recuperaListas();
                    this.loading = false;
                })
                .catch(error => {
                    this.error = error;
                    this.loading = false;
                });
        },

        // Abre a caixa de diálogo para incluir um pdf um card
        abrirInputArquivo: function(lista, card) {
            this.cardEditado = card;
            this.listaEditada = lista;
            this.dialogInputArquivo = true;        
        },

        // Inclui um pdf no card
        uploadArquivo: function() {
            this.error = "";
            this.dialogInputArquivo = false;
            this.loading = true;

            var file = this.arquivo;

            var idLista = this.listaEditada._id;
            var card = this.cardEditado;

            const formData = new FormData();
            formData.append('arquivo', file);

            axios.post(this.httpOptions.baseURL + '/listas/' + idLista + '/card/' + card._id + '/pdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }})
                .then(() => {
                    this.resetarVariaveis();
                    this.recuperaListas();
                    this.loading = false;
                })
                .catch(error => {
                    this.error = error;
                    this.loading = false;
                });
        },

        // Abre a caixa de diálogo para exibir um pdf de um card
        abrirExibirArquivo: function(card, lista) {
            this.cardEditado = card;
            this.listaEditada = lista;
            this.dialogExibirArquivo = true;
        },

        // Abre o pdf de um card em uma nova aba
        abrirArquivo: function(lista, card) {
            this.dialogExibirArquivo = false;
            this.loading = true;

            var idLista = lista._id;
            var idCard = card._id;

            axios.get(this.httpOptions.baseURL + '/listas/' + idLista + '/card/' + idCard + '/pdf', {
                responseType: 'blob'
            })
            .then(response => {
                var fileURL = window.URL.createObjectURL(new Blob([response.data]));
                window.open(fileURL);
                this.loading = false;
                this.resetarVariaveis();
            })
            .catch(error => {
                this.error = error;
                this.loading = false;
            });
        },

        
        
        //
        // MÉTODOS PARA RECUPERAR OS DADOS
        //

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
