<template>
  <div class="home container">
    <search class="mt-5" @loading="isLoading=$event"/>
    <b-spinner v-if="isLoading"></b-spinner>
    <gallery class="mt-5" v-if="isLoading===false"/>
    <gallery class="mt-5" v-else-if="photoList.length"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Search from '../components/Search.vue'
import Gallery from '../components/Gallery.vue'

export default {
  name: 'Home',
  data() {
    return {
      isLoading: null
    }
  },
  components: {
    Search,
    Gallery
  },
  computed: {
    ...mapState(['photoList'])
  }
}
</script>
