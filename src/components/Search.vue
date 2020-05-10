<template>
  <div>
    <div class="form-row mb-3">
      <div class="col-md-6">
        <input type="text" class="form-control" placeholder="Input your keyword" aria-label="Input your keyword" aria-describedby="button-search1" v-model="keyword" @keyup.enter="onSearch">
      </div>
      <div class="col-md-6 mt-md-0 mt-3">
        <input type="text" class="form-control" placeholder="Input your description" aria-label="Input your keyword" aria-describedby="button-search2" v-model="description" @keyup.enter="onSearch">
      </div>
    </div>
    <div class="input-group mb-3">
      <select class="custom-select" v-model="media_type" @keyup.enter="onSearch">
        <option value="image, audio">all</option>
        <option value="image">image</option>
        <option value="audio">audio</option>
      </select>
    </div>
    <div class="input-group mb-3">
      <button type="button" class="btn btn-primary" @click="onSearch">Search</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      keyword: '',
      description: '',
      media_type: 'image, audio',
      isLoading: false
    }
  },
  methods: {
    ...mapActions(['fecthList']),
    onSearch() {
      const searchData = {
        ...(this.keyword.length && { q: this.keyword }),
        ...(this.description.length && { description: this.description }),
        ...(this.media_type.length && { media_type: this.media_type })
      }
      if (this.isLoading) return
      this.isLoading = true
      this.$emit('loading', this.isLoading)
      this.fecthList(searchData).then(() => {
        this.isLoading = false
        this.$emit('loading', this.isLoading)
      })
    }
  }
}
</script>
