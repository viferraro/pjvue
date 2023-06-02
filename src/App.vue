<template>
  <v-app id="inspire">
    <v-app-bar flat>
      <v-container class="fill-height d-flex align-center">
       <v-img
  max-height="50"
  max-width="50"
  src="C:\TrelloJPEricVivi\pjvue\src\assets\treco.png"
></v-img>
        <v-avatar class="me-10 ms-4" color="grey-darken-1" size="32"></v-avatar>

        <v-btn v-for="link in links" :key="link" variant="text">
          {{ link }}
        </v-btn>

        <v-spacer></v-spacer>

        <v-responsive max-width="260">
          <v-text-field density="compact" hide-details variant="solo"></v-text-field>
        </v-responsive>
      </v-container>
    </v-app-bar>

    <v-main class="bg-grey-lighten-3bg">
      <v-container>
        <v-row>
          <v-col cols="2">
            <v-sheet rounded="lg">
              <v-list rounded="lg">
                <v-list-item v-for="n in 2" :key="n" link>
                  <v-list-item-title>
                    List Item {{ n }}
                  </v-list-item-title>
                </v-list-item>

                <v-divider class="my-2"></v-divider>

                <v-list-item link color="grey-lighten-4">
                  <v-list-item-title>
                    Refresh
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-col>

          <v-col>
            <v-sheet min-height="70vh" rounded="lg">
              <v-card max-width="200" class="mx-auto">


                <v-app-bar dark color="blue-grey darken-2">
                  <v-toolbar-title>Vivian</v-toolbar-title>

                  <v-spacer></v-spacer>

                  <v-btn class="ma-2" color="black">
                    <v-icon end icon="mdi-plus" x-small>Tarefa</v-icon>
                    <v-icon small>mdi-plus-circle</v-icon>
                  </v-btn>
                </v-app-bar>

                <v-container cols="12">
                  <v-row dense>
                    <v-col cols="12">
                      <v-card color="#385F73" theme="dark">
                        <v-card-title class="text-h5">
                          Tarefa 1
                        </v-card-title>

                        <v-card-subtitle>Terminar a leitura do livro </v-card-subtitle>

                        <v-card-actions>
                          <v-btn variant="text">
                            Concluída
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>

                    <v-col cols="12">
                      <v-card color="#385F73" theme="dark">
                        <v-card-title class="text-h5">
                          Tarefa 2
                        </v-card-title>

                        <v-card-subtitle>Editar o código</v-card-subtitle>

                        <v-card-actions>
                          <v-btn variant="text">
                            Concluída
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>

                    <v-col cols="12">
                      <v-card color="#385F73" theme="dark">
                        <v-card-title class="text-h5">
                          Tarefa 3
                        </v-card-title>

                        <v-card-subtitle>Escrever o artigo </v-card-subtitle>

                        <v-card-actions>
                          <v-btn variant="text">
                            Concluída
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-sheet>
          </v-col>
          <v-col>
            <v-sheet min-height="70vh" rounded="lg">
              <v-card max-width="200" class="mx-auto">


                <v-app-bar dark color="blue-grey darken-2">
                  <v-toolbar-title>Vivian</v-toolbar-title>

                  <v-spacer></v-spacer>

                  <v-btn class="ma-2" color="black">
                    <v-icon end icon="mdi-plus" x-small>Tarefa</v-icon>
                    <v-icon small>mdi-plus-circle</v-icon>
                  </v-btn>
                </v-app-bar>

                <v-container cols="12">
                  <v-row dense>
                    <v-col cols="12">
                      <v-card color="#385F73" theme="dark">
                        <v-card-title class="text-h5">
                          Tarefa 1
                        </v-card-title>

                        <v-card-subtitle>Terminar a leitura do livro </v-card-subtitle>

                        <v-card-actions>
                          <v-btn variant="text">
                            Concluída
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>

                    <v-col cols="12">
                      <v-card color="#385F73" theme="dark">
                        <v-card-title class="text-h5">
                          Tarefa 2
                        </v-card-title>

                        <v-card-subtitle>Editar o código</v-card-subtitle>

                        <v-card-actions>
                          <v-btn variant="text">
                            Concluída
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>

                    <v-col cols="12">
                      <v-card color="#385F73" theme="dark">
                        <v-card-title class="text-h5">
                          Tarefa 3
                        </v-card-title>

                        <v-card-subtitle>Escrever o artigo </v-card-subtitle>

                        <v-card-actions>
                          <v-btn variant="text">
                            Concluída
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-sheet>
          </v-col>
          <v-col>
            <v-sheet min-height="70vh" rounded="lg">
              <v-card max-width="200" class="mx-auto">


                <v-app-bar dark color="blue-grey darken-2">
                  <v-toolbar-title>Vivian</v-toolbar-title>

                  <v-spacer></v-spacer>

                  <v-btn class="ma-2" color="black">
                    <v-icon end icon="mdi-plus" x-small>Tarefa</v-icon>
                    <v-icon small>mdi-plus-circle</v-icon>
                  </v-btn>
                </v-app-bar>

                <v-container cols="12">
                  <v-row dense>
                    <v-col cols="12">
                      <v-card color="#385F73" theme="dark">
                        <v-card-title class="text-h5">
                          Tarefa 1
                        </v-card-title>

                        <v-card-subtitle>Terminar a leitura do livro </v-card-subtitle>

                        <v-card-actions>
                          <v-btn variant="text">
                            Concluída
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>

                    <v-col cols="12">
                      <v-card color="#385F73" theme="dark">
                        <v-card-title class="text-h5">
                          Tarefa 2
                        </v-card-title>

                        <v-card-subtitle>Editar o código</v-card-subtitle>

                        <v-card-actions>
                          <v-btn variant="text">
                            Concluída
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>

                    <v-col cols="12">
                      <v-card color="#385F73" theme="dark">
                        <v-card-title class="text-h5">
                          Tarefa 3
                        </v-card-title>

                        <v-card-subtitle>Escrever o artigo </v-card-subtitle>

                        <v-card-actions>
                          <v-btn variant="text">
                            Concluída
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    links: [
      'Dashboard',
      'Messages',
      'Profile',
      'Updates',
    ],
  }),
}
</script>