<template>
   <div id="p-video">
    <div id="v-title" ><span>{{shipName}}{{camcaLoca}}实时视频</span></div>
    <playerHls ref="playerHls" @play="play" :video="video" :contextmenu="contextmenu"></playerHls>
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
    camcaLoca: {
      type: String,
      default: ""
    },
    video: {
      url: "",
      urlHD: ""
    },
    contextmenu: {
      type: Array,
      default: () => [{
        text: '夫子庙秦淮风光带',
        link: 'https://baike.baidu.com/item/%E5%A4%AB%E5%AD%90%E5%BA%99%E7%A7%A6%E6%B7%AE%E9%A3%8E%E5%85%89%E5%B8%A6/10475554?fr=aladdin'
      }]
    },
    data() {
      return {
        myPlayer: null
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.myPlayer = this.$refs.playerHls.dp // 获取新播放器句柄
    },
    switchVideo(video) {
      this.myPlayer.switchVideo(video)
      // console.log(video.url)
    },
    play() {
      console.log('myPlayer callback')
    }
  }
}
</script>

<style scoped>
  #p-video{
    border: 0;   
    padding: 5px;
    width: 100%;
    height: auto;
  }
  #p-video #v-title{
    width: 100%;
    height: 26px;
    background-color: #eeeff1;
    color: #303133;
    text-align: center;
    font-size: 13px;
    line-height: 28px;
  }
</style>