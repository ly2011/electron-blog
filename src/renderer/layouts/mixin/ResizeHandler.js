import store from '@/store'

// const { body } = document
// const WIDTH = 600
// const RATIO = 3

export default {
  watch: {
    $route (route) {
      if (this.device === 'mobile' && this.sidebar.opened) {
        store.dispatch('app/CloseSideBar', { withoutAnimation: false })
      }
    }
  },
  beforeMount () {
    window.addEventListener('resize', this.resizeHandler)
  },
  mounted () {
    const isMobile = this.isMobile()
    if (isMobile) {
      store.dispatch('app/ToggleDevice', 'mobile')
      store.dispatch('app/CloseSideBar', { withoutAnimation: true })
    }
  },
  methods: {
    isMobile () {
      // const rect = body.getBoundingClientRect()
      // return rect.width - RATIO < WIDTH
      return false
    },
    resizeHandler () {
      if (!document.hidden) {
        const isMobile = this.isMobile()
        store.dispatch('app/ToggleDevice', isMobile ? 'mobile' : 'desktop')

        if (isMobile) {
          store.dispatch('app/CloseSideBar', { withoutAnimation: true })
        }
      }
    }
  }
}
