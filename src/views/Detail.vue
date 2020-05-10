<template>
  <div>
    <div class="container">
      <router-link
        :to="`/`"
      >Back To Gallery</router-link>
      <div v-if="item" class="text-center">
        <div v-html="item.title" class="mb-3"></div>
        <img :src="item.imgUrl" :alt="item.title">
        <div v-html="item.description" class="mt-3"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['photoList'])
  },
  data() {
    return {
      item: null
    }
  },
  created() {
    this.item = this.photoList.find((data) => data.id === this.$route.params.id)
  }
}
</script>
