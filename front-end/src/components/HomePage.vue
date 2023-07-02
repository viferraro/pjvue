<template>
  <v-container>
    
    <v-col>      
      <h1>TaskVerse</h1>
      <p>Organize suas tarefas com eficiência e simplicidade: simplifique sua vida com TaskVerse.</p>
    </v-col>
    
    <v-carousel
      cycle
      height=400
      hide-delimiters
      show-arrows-on-hover
    >
      <v-carousel-item 
        v-for="(item,i) in itens" 
        :key="i" 
        :src="item.src"
      >

      <v-sheet color="rgba(255, 255, 255, 0.3)">
        <v-col 
          cols="12" 
          class="text-justify"
        >
          <div class="text-h4">
            {{ textos[i].texto }}
          </div>
        </v-col>
      </v-sheet>
      </v-carousel-item>

    </v-carousel>

    <v-row v-if="!$root.credentials" align="center">
      <v-col 
      cols="12"
      md="3"
      align="center"
      >        
        <router-link class="white--text" :to="{ name: 'login' }">
          <v-btn
            color="primary"
            class="white--text"
          >
            Login
          </v-btn>
        </router-link>

        <router-link :to="{ name: 'registro' }">
          <v-btn
            color="primary"
            class="white--text"
          >
            Crie sua conta
          </v-btn>
        </router-link>      
      </v-col>
    </v-row>
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
          texto: "Maior produtividade ao seu alcance! Simplifique suas tarefas diárias com o TaskVerse e desfrute de uma organização eficiente, permitindo que você se concentre no que é realmente importante.",
        },
        {
          texto: "Sincronização perfeita em todos os dispositivos. Com o TaskVerse, suas listas de tarefas estão sempre atualizadas, seja no seu smartphone, tablet ou computador. Mantenha-se organizado onde quer que você esteja.",
        },
        {
          texto: "Uma experiência intuitiva e personalizada. O TaskVerse oferece recursos flexíveis de personalização, permitindo que você adapte o aplicativo às suas necessidades e estilo de trabalho. Simplifique sua rotina e alcance o máximo de produtividade.",
        },
        {
          texto: "Crie ou acesse sua conta agora para ter acesso a todas as facilidades que o TaskVerse oferece.",
        },
      ]
    }),
  }
</script>