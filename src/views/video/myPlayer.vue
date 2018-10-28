<template>
   <div id="p-video">
    <div id="v-title" ><span>{{videoInfo.shipName}}的{{videoInfo.camcaLoca}}实时视频</span><span v-if="videoInfo.shipStatus === '1'">||运行中</span><span v-else>||未运行</span></div>
    <playerHls ref="player" @play="play" :video="video" :contextmenu="contextmenu"></playerHls>
  </div>
</template>

<script>
import playerHls from './playerHls'
export default {
  name: 'myPlayer',
  components: {
    playerHls
  },
  props: {
    videoInfo: {
      shipName: "",
      camcaLoca: "",
      shipStatus: '0',
      shipUrl: "",
      shipUrlHD: ""
    }
  },
  mounted() {
    this.init()
  },
  data() {
    return {
      autoplay: false,
      player: null,
      contextmenu: [{
        text: '夫子庙秦淮风光带',
        link: 'https://baike.baidu.com/item/%E5%A4%AB%E5%AD%90%E5%BA%99%E7%A7%A6%E6%B7%AE%E9%A3%8E%E5%85%89%E5%B8%A6/10475554?fr=aladdin'
      }]
    }
  },
  computed: {
    video: function() {
      if (!this.videoInfo.shipUrl || this.videoInfo.shipUrl === "") {
        return {
          url: "/",
          urlHD: "/"
        }
      } else {
        return {
          url: this.videoInfo.shipUrl,
          urlHD: this.videoInfo.shipUrlHD
        }
      }
    }
  },
  methods: {
    init() {
      this.player = this.$refs.player.dp
    },
    play() {
      console.log('play callback')
    }
  }
}
</script>

<style scoped>
  #p-video{
    padding: 0 4px 8px 4px;
    width: 100%;
  }
  #p-video #v-title{
    width: 100%;
    background-color: bisque;
    text-align: center;
    font-size: 13px;
  } 
</style>