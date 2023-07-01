<template>
    <v-container>
        <v-main>
        <v-container>
            <v-row>
            <v-col cols="12">
                <v-sheet>
                <v-row>
                    <v-col cols="12">
                    <v-card>
                        <v-card-title>
                        <h1>Novo Quadro</h1>
                        </v-card-title>
                        <v-card-text>
                        <v-form>
                            <v-text-field
                              label="Nome do Quadro"
                              required
                            >
                            </v-text-field>
                            
                            <v-row
                              class="fill-height"
                              align="center"
                              justify="left"
                            >
                                <v-col
                                  cols="12"
                                  md="2"
                                  align="center"
                                >
                                <v-text-field readonly hide-details solo placeholder="Cor de fundo">
                                  <template v-slot:append>
                                    <v-menu v-model="menuFundo" top nudge-bottom="105" nudge-left="16" :close-on-content-click="false">
                                      <template v-slot:activator="{ on }">
                                        <div :style="trocaEstiloFundo" v-on="on" />
                                      </template>
                                      <v-card>
                                        <v-card-text class="pa-0">
                                          <v-color-picker 
                                            v-model="corFundo" 
                                            flat
                                            hide-canvas
                                            hide-inputs
                                            show-swatches
                                          />
                                        </v-card-text>
                                      </v-card>
                                    </v-menu>
                                  </template>
                                </v-text-field>                                   
                                </v-col>

                                <v-col
                                  cols="12"
                                  md="2"
                                >
                                <v-text-field readonly hide-details solo placeholder="Cor de texto" >
                                  <template v-slot:append>
                                    <v-menu v-model="menuTexto" top nudge-bottom="105" nudge-left="16" :close-on-content-click="false">
                                      <template v-slot:activator="{ on }">
                                        <div :style="trocaEstiloTexto" v-on="on" />
                                      </template>
                                      <v-card>
                                        <v-card-text class="pa-0">
                                          <v-color-picker 
                                            v-model="corTexto" 
                                            flat
                                            hide-canvas
                                            hide-inputs
                                            show-swatches
                                          />
                                        </v-card-text>
                                      </v-card>
                                    </v-menu>
                                  </template>
                                </v-text-field>                                   
                                </v-col>
                                
                                <v-col
                                  cols="12"
                                  md="2"
                                >
                                  <v-template>
                                    <v-checkbox
                                      v-model="editavel"
                                      label="Editável"
                                    ></v-checkbox>
                                  </v-template>
                                </v-col>

                                <v-col
                                  cols="12"
                                  md="2"
                                >
                                  <v-template>
                                    <v-checkbox
                                      v-model="favorito"
                                      label="Favorito"
                                    ></v-checkbox>
                                  </v-template>
                                </v-col>
                                
                              </v-row>


                            <v-btn color="primary">Salvar</v-btn>
                        </v-form>
                        </v-card-text>
                    </v-card>
                    </v-col>
                </v-row>
                </v-sheet>
            </v-col>
            </v-row>
        </v-container>
        </v-main>
    </v-container>
</template>

<script>
    export default {
      data: () => ({
        corFundo: '#1976D2FF',
        corTexto: '#000000',        
        menuFundo: false,
        menuTexto: false,
        editavel: false,
        favorito: false,
      }),
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
    }        
</script>