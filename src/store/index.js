import Vue from 'vue'
import Vuex from 'vuex'
import axios from './axios'

Vue.use(Vuex)

const list = JSON.parse(localStorage.getItem('photoList'))
const toggleItem = (store, id, state) => {
  const photoList = [...store.filter((photo) => {
    if (photo.id === id) {
      photo.deleted = state
    }
    return photo
  })]
  return photoList
}
export default new Vuex.Store({
  state: {
    photoList: list || []
  },
  mutations: {
    savePhotoList(state, data) {
      state.photoList = [...data]
    }
  },
  actions: {
    fecthList({ commit }, query) {
      axios.get('search', {
        params: {
          ...query
        }
      }).then((res) => {
        if (res.status === 200) {
          return Promise.all(res.data.collection.items.map((subItem) => new Promise((resolve) => {
            axios.get(subItem.href, { baseURL: '' }).then((res1) => {
              const {
                description, nasa_id, title, date_created
              } = subItem.data[0]
              const imgUrl = res1.data.find((item) => item.includes('~thumb.jpg'))
              resolve({
                id: nasa_id,
                description,
                imgUrl,
                title,
                liked: false,
                deleted: false,
                date_created
              })
            }).catch(() => resolve(null))
          }))).then((data) => data.filter((item) => item)).then((data) => {
            commit('savePhotoList', data)
            localStorage.setItem('photoList', JSON.stringify(data))
          })
        }
        return null
      })
    },
    removeItem({ state, commit }, id) {
      const photoList = toggleItem(state.photoList, id, true)
      commit('savePhotoList', photoList)
      localStorage.setItem('photoList', JSON.stringify(photoList))
    },
    undoItem({ state, commit }, id) {
      const photoList = toggleItem(state.photoList, id, false)
      commit('savePhotoList', photoList)
      localStorage.setItem('photoList', JSON.stringify(photoList))
    },
    toggleLikeItem({ state, commit }, id) {
      const photoList = [...state.photoList.map((photo) => {
        if (photo.id === id) {
          photo.liked = !photo.liked
        }
        return photo
      })]
      commit('savePhotoList', photoList)
      localStorage.setItem('photoList', JSON.stringify(photoList))
    },
    updateItem({ state, commit }, item) {
      const photoList = [...state.photoList.map((photo) => {
        if (photo.id === item.id) {
          photo.liked = item
        }
        return photo
      })]
      commit('savePhotoList', photoList)
      localStorage.setItem('photoList', JSON.stringify(photoList))
    }
  },
  modules: {}
})
