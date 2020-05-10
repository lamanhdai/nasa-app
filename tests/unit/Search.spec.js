import { mount } from '@vue/test-utils'
import Search from '../../src/components/Search.vue'

describe('Search', () => {
  it('default media type is all', () => {
    expect(typeof Search.data).toBe('function')
    const defaultData = Search.data()
    expect(defaultData.media_type).toBe('image, audio')
  })

  test('is a Vue instance', () => {
    const wrapper = mount(Search)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
