<template>
   <div id="p-video">
     <div id="v-title" ><span>{{shipName}}的实时视频</span><span v-if="shipStatus === '1'">||运行中</span><span v-else>||未运行</span></div>
    <my-player ref="player" @play="play" :video="video" :contextmenu="contextmenu"></my-player>
  </div>
</template>

<script>
import playerHls from './playerHls'
export default {
  name: 'myPlayer',
  components: {
    'my-player': playerHls
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
        text: 'GitHub',
        link: 'https://github.com/MoePlayer/vue-dplayer'
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
    margin-left: 2px;
    width: 100%;
    background-color: bisque;
    text-align: center;
    font-size: 13px;
  } 
</style>