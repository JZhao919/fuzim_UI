<template>
   <div id="p-video">
    <div id="v-title" ><span>{{shipName}}的实时视频</span><span v-if="shipStatus === '1'">||运行中</span><span v-else>||未运行</span></div>
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
    shipVideoInfo: {
      shipName: '',
      shipStatus: '',
      url: '',
      urlHD: '',
      pic: {
        type: String,
        default: 'http://static.smartisanos.cn/pr/img/video/video_03_cc87ce5bdb.jpg'
      }
    }
  },
  mounted() {
    this.player = this.$refs.player.dp
  },
  data() {
    return {
      autoplay: false,
      shipName: this.shipVideoInfo.shipName,
      shipStatus: this.shipVideoInfo.shipStatus,
      video: {
        url: this.shipVideoInfo.url,
        urlHD: this.shipVideoInfo.urlHD,
        pic: this.shipVideoInfo.pic
      },
      contextmenu: [{
        text: '夫子庙秦淮风光带',
        link: 'https://baike.baidu.com/item/%E5%A4%AB%E5%AD%90%E5%BA%99%E7%A7%A6%E6%B7%AE%E9%A3%8E%E5%85%89%E5%B8%A6/10475554?fr=aladdin'
      }],
      player: null
    }
  },
  methods: {
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