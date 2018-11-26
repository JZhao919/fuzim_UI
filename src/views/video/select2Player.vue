<template>
   <div id="p-video">
    <div id="v-title" ><span>{{shipName}}{{videoInfo.camcaLoca}}实时视频</span><span v-if="shipStatus === '1'">||运行中</span><span v-else>||未运行</span></div>
    <playerHls  id="select2player" ref="myPlayer" @play="play" :video="video" :contextmenu="contextmenu"></playerHls>
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
    shipName: {
      type: String,
      default: ""
    },
    shipStatus: {
      type: String,
      default: "0"
    },
    videoInfo: {
      camcaLoca: "",
      shipUrl: "",
      shipUrlHD: ""
    }
  },
  data() {
    return {
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
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.player = this.$refs.myPlayer.dp // 获取新播放器句柄
    },
    reinit() {
      this.player.destroy()
      this.$refs.myPlayer.init() // 重新初始化播放器
      this.player = this.$refs.myPlayer.dp // 获取新播放器句柄
    },
    play() {
      console.log('trailplayer callback')
    }
  }
}
</script>

<style scoped>
  #p-video{
    border: 0;
    margin-bottom: 10px;
    padding: 5px;
    width: 100%;
    height: auto;
  }
  #p-video #v-title{
    width: 100%;
    height: 30px;
    background-color: #eeeff1;
    color: #303133;
    text-align: center;
    font-size: 13px;
    line-height: 32px;
  }
</style>