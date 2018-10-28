<template>
  <div class="mydplayer"></div>
</template>
<script>
window.Hls = require('hls.js')
require('../../../node_modules/dplayer/dist/DPlayer.min.css')
import DPlayer from 'dplayer'
var player
export default {
  props: {
    autoplay: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default: '#FADFA3'
    },
    loop: {
      type: Boolean,
      default: false
    },
    lang: {
      type: String,
      default: 'zh-cn'
    },
    screenshot: {
      type: Boolean,
      default: false
    },
    hotkey: {
      type: Boolean,
      default: true
    },
    preload: {
      type: String,
      default: 'auto'
    },
    contextmenu: {
      type: Array,
      default: [{
        text: '夫子庙秦淮风光带',
        link: 'https://baike.baidu.com/item/%E5%A4%AB%E5%AD%90%E5%BA%99%E7%A7%A6%E6%B7%AE%E9%A3%8E%E5%85%89%E5%B8%A6/10475554?fr=aladdin'
      }]
    },
    logo: {
      type: String
    },
    video: {
      type: Object,
      required: true,
      validator(value) {
        return typeof value.url === 'string'
      }
    },
    data() {
      return {
        dp: null
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (player) {
        player = null
      }
      player = this.dp = new DPlayer({
        element: this.$el,
        live: true,
        autoplay: this.autoplay,
        theme: this.theme,
        loop: this.loop,
        lang: this.lang,
        screenshot: this.screenshot,
        hotkey: this.hotkey,
        preload: this.preload,
        contextmenu: this.contextmenu,
        logo: this.logo,
        mutex: true,
        video: {
          quality: [{
            name: 'SD',
            url: this.video.url,
            type: this.video.type
          }, {
            name: 'HD',
            url: this.video.urlHD,
            type: this.video.type
          }],
          defaultQuality: 0
        }
      })
      player.on('play', () => {
        this.$emit('play')
      })
      player.on('pause', () => {
        this.$emit('pause')
      })
      player.on('canplay', () => {
        this.$emit('canplay')
      })
      player.on('playing', () => {
        this.$emit('playing')
      })
      player.on('ended', () => {
        this.$emit('ended')
      })
      player.on('error', () => {
        this.$emit('error')
      })
    },
    destroy() {
      if (player) {
        player.destroy() // 销毁播放器
        player = null
      }
    }
  }
}
</script>
<style scoped>
  .mydplayer{
    width: 100%;
    height: auto;
    margin: 0;
    border: 0;
    padding: 0;
  }
</style>
