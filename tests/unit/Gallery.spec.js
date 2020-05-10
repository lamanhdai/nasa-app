import Gallery from '../../src/components/Gallery.vue'

describe('Gallery', () => {
  it('default media type is all', () => {
    expect(typeof Gallery.data).toBe('function')
    const defaultData = Gallery.data()
    expect(defaultData.activeTab).toBe('all')
    expect(defaultData.sortType).toBe('latest')
  })
})
