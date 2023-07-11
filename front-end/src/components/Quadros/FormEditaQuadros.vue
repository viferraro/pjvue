<template>
    <v-container>
        <v-main>
            <v-container>
                <v-row>
                    <v-col cols="6">
                        <v-sheet>
                            <v-row>
                                <v-col cols="12">
                                    <v-card>
                                        <v-card-title>
                                            <h1>Atualizar o quadro</h1>
                                        </v-card-title>
                                        <v-card-text>
                                            <v-row class="fill-height" align="center" justify="left">
                                                <v-col cols="12">
                                                    <v-form>
                                                        <v-text-field label='Título' required v-model="quadro.titulo">
                                                        </v-text-field>
                                                        <v-row>
                                                            <v-col cols="12" md="6" align="center">
                                                                <v-text-field readonly hide-details solo
                                                                    placeholder="Cor de fundo">
                                                                    <template v-slot:append>
                                                                        <v-menu v-model="menuFundo" top nudge-bottom="105"
                                                                            nudge-left="16" :close-on-content-click="false">
                                                                            <template v-slot:activator="{ on }">
                                                                                <div :style="trocaEstiloFundo" v-on="on" />
                                                                            </template>
                                                                            <v-card>
                                                                                <v-color-picker v-model="corFundo" flat
                                                                                    hide-canvas hide-inputs show-swatches />
                                                                            </v-card>
                                                                        </v-menu>
                                                                    </template>
                                                                </v-text-field>
                                                            </v-col>
                                                            <v-col cols="12" md="6">
                                                                <v-text-field readonly hide-details solo
                                                                    placeholder="Cor de texto">
                                                                    <template v-slot:append>
                                                                        <v-menu v-model="menuTexto" top nudge-bottom="105"
                                                                            nudge-left="16" :close-on-content-click="false">
                                                                            <template v-slot:activator="{ on }">
                                                                                <div :style="trocaEstiloTexto" v-on="on" />
                                                                            </template>
                                                                            <v-card>
                                                                                <v-color-picker v-model="corTexto" flat
                                                                                    hide-canvas hide-inputs show-swatches />
                                                                            </v-card>
                                                                        </v-menu>
                                                                    </template>
                                                                </v-text-field>
                                                            </v-col>
                                                        </v-row>
                                                        <v-row>
                                                            <v-col cols="12" md="6">
                                                                <v-template>
                                                                    <v-checkbox v-model="favorito"
                                                                        label="Favorito"></v-checkbox>
                                                                </v-template>
                                                            </v-col>
                                                        </v-row>
                                                        <v-btn color="primary" @click="atualizaQuadro()"
                                                            :disabled="!quadro.titulo">
                                                            Alterar
                                                        </v-btn>
                                                    </v-form>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-sheet>
                    </v-col>
                    <v-sheet class="mx-auto" max-width="344" tile>
                        <v-row class="fill-height" align="center" justify="center">
                            <v-col cols="12">
                                <div class="overline mb-4">Prévia</div>
                                <v-card class="mx-auto" max-width="344" elevation="15"
                                    :style="{ backgroundColor: corFundo }">
                                    <v-list-item three-line>
                                        <v-list-item-content>
                                            <v-row>
                                                <v-col cols="10" justify="space-between">
                                                    <v-list-item-title class="headline mb-1" :style="{ color: corTexto }">
                                                        <v-btn icon>
                                                            <v-icon :color="favorito ? 'yellow' : 'grey'">
                                                                mdi-star
                                                            </v-icon>
                                                        </v-btn>
                                                        {{ quadro.titulo }}
                                                    </v-list-item-title>
                                                </v-col>
                                            </v-row>
                                            <v-list v-for="item in 5" :key="item"
                                                :style="{ backgroundColor: corAjustada(corFundo) }">
                                                <v-list-item border-bottom>
                                                    <v-list-item-content>
                                                        <v-list-item-title :style="{ color: corTexto }">Lista {{
                                                            item
                                                        }}
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
                </v-row>
            </v-container>
        </v-main>
    </v-container>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            quadro: null,

            corFundo: '#4071ad',
            corTexto: '#000000',
            favorito: false,
            menuFundo: false,
            menuTexto: false,
            lightenAmount: 0.3,

            items: [],
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

    computed: {
        trocaEstiloFundo() {
            const { corFundo: color, menuFundo: menu } = this
            console.log(color)
            return {
                backgroundColor: color,
                cursor: 'pointer',
                height: '30px',
                width: '30px',
                borderRadius: menu ? '50%' : '4px',
                transition: 'border-radius 200ms ease-in-out'
            }
        },

        trocaEstiloTexto() {
            const { corTexto: color, menuTexto: menu } = this
            console.log(color)
            return {
                backgroundColor: color,
                cursor: 'pointer',
                height: '30px',
                width: '30px',
                borderRadius: menu ? '50%' : '4px',
                transition: 'border-radius 200ms ease-in-out'
            }
        },
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

        //função para recuperar um quadro específico
        recuperaQuadro: function () {
            this.quadro = null;
            var idQuadro = this.$route.params.id;
            this.loading = true;
            axios.get('http://localhost:3000/quadros/' + idQuadro, this.httpOptions)
                .then(response => {
                    this.quadro = response.data;
                    this.corFundo = this.quadro.corFundo;
                    this.corTexto = this.quadro.corTexto;
                    this.favorito = this.emailFavorito(this.quadro);
                    this.loading = false;
                })
                .catch(error => {
                    this.loading = false;
                    this.error = error;
                })
        },

        emailFavorito: function (quadro) {
            var email = this.$root.credentials.email;

            if (quadro.favorito.includes(email)) {
                return true;
            }
            else {
                return false;
            }
        },

        //função para atualizar um quadro específico
        atualizaQuadro: function () {
            this.atualizaFavorito();
            this.loading = true;
            axios.put('http://localhost:3000/quadros/' + this.quadro._id, {
                titulo: this.quadro.titulo,
                corFundo: this.corFundo,
                corTexto: this.corTexto,
                favorito: this.quadro.favorito,

            }, this.httpOptions)
                .then(() => {
                    this.loading = false;
                    this.$router.replace('/quadros/');
                })
                .catch(error => {
                    this.loading = false;
                    this.error = error;
                })
        },

        //função para atualizar o valor favorito
        atualizaFavorito: function () {
            var email = this.$root.credentials.email;
            var index = this.quadro.favorito.indexOf(email);

            if (index > -1) {
                this.quadro.favorito.splice(index, 1);
            }
            else {
                this.quadro.favorito.push(email);
            }
        },
    },

    mounted() {
        this.recuperaQuadro();
    }
}

</script>