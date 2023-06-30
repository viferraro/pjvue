<template>
  <v-container>
    
    <!-- Incluir uma página default sobre o site de quadros e tarefas -->
    <h1>TaskVerso</h1>
    <p>Organize suas tarefas com eficiência e simplicidade: simplifique sua vida com TaskVerso.</p>
    <p>Para acessar as funcionalidades do site, faça o login ou crie uma conta.</p>
    
    <v-carousel
      cycle
      height=600
      hide-delimiters
      show-arrows-on-hover
    >
      <v-carousel-item 
        v-for="(item,i) in itens" 
        :key="i" 
        :src="item.src"
      >

      <v-sheet color="grey lighen-3" opacity="0.1">
        <v-col 
          cols="1" 
          sm="8" 
          offset-sm="2" 
          class="text-left"
        >
          <div class="text-h4">
            {{ textos[i].texto }}
          </div>
        </v-col>
      </v-sheet>
      </v-carousel-item>

    </v-carousel>

    <p v-if="!$root.credentials">
      <router-link class="link" :to="{ name: 'login' }">
        <a class="btn btn-lg btn-success" href="#" role="button">Login</a>
      </router-link>
    </p>
  </v-container>

</template>

<script>
  import imagemCarousel1 from "../assets/Imagens/download.jpg";
  import imagemCarousel2 from '../assets/Imagens/HowToEffectiveAssignTasksToTeamMembersToIncreaseProductivity.jpg'
  import imagemCarousel3 from '../assets/Imagens/Networking-1-1024x683.jpg'
  import imagemCarousel4 from '../assets/Imagens/Networking-2.jpg'

  export default {

    data: () => ({
      itens:[
        {
          src: imagemCarousel1,
        },
        {
          src: imagemCarousel2,
        },
        {
          src: imagemCarousel3,
        },
        {
          src: imagemCarousel4,
        },
      ],
      textos: [
        {
          texto: "Maior produtividade ao seu alcance! Simplifique suas tarefas diárias com o TaskVerso e desfrute de uma organização eficiente, permitindo que você se concentre no que é realmente importante.",
        },
        {
          texto: "Sincronização perfeita em todos os dispositivos. Com o TaskVerso, suas listas de tarefas estão sempre atualizadas, seja no seu smartphone, tablet ou computador. Mantenha-se organizado onde quer que você esteja.",
        },
        {
          texto: "Uma experiência intuitiva e personalizada. O TaskVerso oferece recursos flexíveis de personalização, permitindo que você adapte o aplicativo às suas necessidades e estilo de trabalho. Simplifique sua rotina e alcance o máximo de produtividade.",
        },
        {
          texto: "Crie ou acesse sua conta agora para ter acesso a todas as facilidades que o TaskVerso oferece.",
        },
      ]
    }),
  }
</script>