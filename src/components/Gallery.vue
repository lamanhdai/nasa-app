<template>
  <div>
    Sort By:
    <div class="custom-control custom-radio custom-control-inline">
      <input type="radio" id="sort1" name="sortPhoto" class="custom-control-input" value="latest" @change="updateSort" :checked="true">
      <label class="custom-control-label" for="sort1">Latest</label>
    </div>
    <div class="custom-control custom-radio custom-control-inline">
      <input type="radio" id="sort2" name="sortPhoto" class="custom-control-input" value="oldest" @change="updateSort">
      <label class="custom-control-label" for="sort2">Oldest</label>
    </div>
    <div class="custom-control custom-radio custom-control-inline">
      <input type="radio" id="ASC" name="sortPhoto" class="custom-control-input" value="ASC" @change="updateSort">
      <label class="custom-control-label" for="ASC">ASC</label>
    </div>
    <div class="custom-control custom-radio custom-control-inline">
      <input type="radio" id="DES" name="sortPhoto" class="custom-control-input" value="DES" @change="updateSort">
      <label class="custom-control-label" for="DES">DES</label>
    </div>

    <ul class="nav nav-tabs mt-3" id="myTab" role="tablist">
      <li class="nav-item">
        <a class="nav-link" :class="{active: activeTab==='all'}" id="all-tab" data-toggle="tab" role="tab" aria-controls="all" aria-selected="true" @click="changeTab('all')">ALL</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{active: activeTab==='liked'}" id="liked-tab" data-toggle="tab" role="tab" aria-controls="liked" aria-selected="false" @click="changeTab('liked')">Liked</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{active: activeTab==='deleted'}" id="deleted-tab" data-toggle="tab" role="tab" aria-controls="deleted" aria-selected="false" @click="changeTab('deleted')">Deleted</a>
      </li>
    </ul>
    <div v-show="activeTab==='all'">
      <div class="row">
        <div v-for="item in filteredList" :key="item.id" class="item col-6 col-lg-3 mb-3">
            <div class="icon-remove" @click="removeItem(item.id)">
              <img src="@/assets/img/remove.svg" alt="close" />
            </div>
            <router-link
              :to="`/item/${item.id}`"
            >
              <div class="img">
                <b-img-lazy :src="item.imgUrl" :alt="item.title" class="img-fluid"></b-img-lazy>
              </div>
              <div v-html="item.title" class="text-center"></div>
            </router-link>
            <div>Date created: {{item.date_created |formattedDate}}</div>
            <div class="control text-center">
              <div class="icon-like d-inline-block icon" @click="toggleLikeItem(item.id)" :class="{liked: item.liked}">
              </div>
              <div class="icon-edit d-inline-block icon" @click="showModal(item)">
                <img src="@/assets/img/edit.svg" alt />
              </div>
            </div>

        </div>
      </div>
    </div>
    <div v-show="activeTab==='liked'">
      <div class="row"
      >
        <div v-for="item in likedList" :key="item.id" class="item-liked  col-6 col-lg-3">
            <router-link
              :to="`/item/${item.id}`"
            >
              <div class="img">
                <b-img-lazy :src="item.imgUrl" :alt="item.title" class="img-fluid"></b-img-lazy>
              </div>
              <div v-html="item.title" class="text-center"></div>
            </router-link>
            <div>Date created: {{item.date_created |formattedDate}}</div>
            <div class="control text-center">
              <div class="icon-edit d-inline-block icon" @click="showModal(item)">
                <img src="@/assets/img/edit.svg" alt />
              </div>
            </div>

        </div>
      </div>
    </div>
    <div v-show="activeTab==='deleted'">
      <div class="row"
      >
        <div v-for="item in deletedList" :key="item.id" class="item-deleted col-6 col-lg-3">
          <div class="img">
            <b-img-lazy :src="item.imgUrl" :alt="item.title" class="img-fluid"></b-img-lazy>
          </div>
          <div v-html="item.title" class="text-center"></div>
          <div>Date created: {{item.date_created |formattedDate}}</div>
          <div class="control text-center">
              <div class="icon-edit d-inline-block icon" @click="undoItem(item.id)">
                <img src="@/assets/img/undo.svg" alt />
              </div>
            </div>
        </div>
      </div>
    </div>

    <b-modal id="modalEdit" title="Editing Photo" ref="modal-edit" @hide="cancelEditing" @ok="consentEditing">
      <div v-if="editedItem">
        <img :src="editedItem.imgUrl" :alt="editedItem.title" class="img-fluid">
        <div class="input-group my-3">
          <input type="text" class="form-control" placeholder="title" aria-label="title" aria-describedby="input for title" v-model="editedItem.title">
        </div>
        <div class="input-group mb-3">
          <textarea v-model="editedItem.description" class="form-control" placeholder="description" aria-label="description" aria-describedby="input for description"></textarea>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      option: {
        itemSelector: '.responsive-item',
        getSortData: {
          id: 'id'
        },
        sortBy: 'id'
      },
      editedItem: null,
      activeTab: 'all',
      sortType: 'latest'
    }
  },
  methods: {
    ...mapActions(['removeItem', 'toggleLikeItem', 'updateItem', 'undoItem']),
    showModal(item) {
      this.editedItem = item
      this.$refs['modal-edit'].show()
    },
    cancelEditing() {
      this.editedItem = null
    },
    consentEditing() {
      this.updateItem(this.editedItem)
      this.editedItem = null
    },
    changeTab(tab) {
      this.activeTab = tab
    },
    sortBy(photoList, sortType) {
      if (sortType === 'latest' || sortType === 'oldest') {
        return photoList.sort((item1, item2) => {
          const date1 = new Date(item1.date_created)
          const date2 = new Date(item2.date_created)
          return sortType === 'latest' ? (date2 - date1) : (date1 - date2)
        })
      } if (sortType === 'ASC' || sortType === 'DES') {
        return photoList.sort((item1, item2) => {
          const text1 = new Date(item1.title)
          const text2 = new Date(item2.title)
          return sortType === 'ASC' ? (text2 - text1) : (text1 - text2)
        })
      }
      return []
    },
    updateSort(evt) {
      this.sortType = evt.target.value
    }
  },
  computed: {
    ...mapState(['photoList']),
    filteredList() {
      const list = this.photoList.filter((photo) => !photo.deleted)
      const sort = this.sortType
      return this.sortBy(list, sort)
    },
    likedList() {
      const list = this.photoList.filter((photo) => photo.liked && !photo.deleted)
      const sort = this.sortType
      return this.sortBy(list, sort)
    },
    deletedList() {
      const list = this.photoList.filter((photo) => photo.deleted)
      const sort = this.sortType
      return this.sortBy(list, sort)
    }
  },
  filters: {
    formattedDate(value) {
      const date = new Date(value)
      return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
    }
  }
}
</script>

<style lang="scss">
.item {
  width: 25%;
  &:hover {
    .icon-remove {
      display: block;
    }
  }
}
.img {
  padding: 10px 0;
}
.icon-remove {
  display: none;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  img {
    width: 20px;
    height: 20px;
  }
}
.icon-like {
  background: url(../assets/img/like.svg) no-repeat left top;
  background-size: contain;
  width: 20px;
  height: 20px;
  &.liked {
    background: url(../assets/img/liked.svg) no-repeat left top;
  }
}
.icon {
  cursor: pointer;
  margin: 5px;
  vertical-align: middle;
  &:hover {
    opacity: .8;
  }
}
</style>
