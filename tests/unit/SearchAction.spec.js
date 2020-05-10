import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Search from '../../src/components/Search.vue'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('Actions', () => {
  let actions
  let store

  beforeEach(() => {
    actions = {
      fecthList: jest.fn()
    }
    store = new Vuex.Store({
      actions
    })
  })

  it('calls store action "fecthList" when input is keyup', () => {
    const wrapper = shallowMount(Search, { store, localVue })
    const input = wrapper.find('input')
    input.element.value = 'not input'
    input.trigger('keydown.up', { key: 'Enter' })
    expect(actions.fecthList).not.toHaveBeenCalled()
  })

  it('calls store action "fecthList" when button search is clicked', () => {
    const wrapper = shallowMount(Search, { store, localVue })
    wrapper.find('button').trigger('click')
    expect(actions.fecthList).toHaveBeenCalled()
  })
})
