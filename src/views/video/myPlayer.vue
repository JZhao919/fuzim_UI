<template>
   <div id="p-video">
    <div id="v-title" ><span>{{shipName}}的实时视频</span><span v-if="shipStatus === '1'">||运行中</span><span v-else>||未运行</span></div>
    <playerHls ref="playerh" @play="play" :video="videoh" :contextmenu="contextmenu"></playerHls>
    <playerHls ref="playerb" @play="play" :video="videob" :contextmenu="contextmenu"></playerHls>
    <playerHls ref="playert" @play="play" :video="videot" :contextmenu="contextmenu"></playerHls>
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
      shipName: "",
      shipStatus: '0',
      shipCamheadUrl: "",
      shipCamheadUrlHD: "",
      shipCamcabinUrl: "",
      shipCamcabinUrlHD: "",
      shipCamtailUrl: "",
      shipCamtailUrlHD: ""
    }
  },
  mounted() {
    this.init()
  },
  data() {
    return {
      autoplay: false,
      playerh: null,
      playerb: null,
      playert: null,
      contextmenu: [{
        text: '夫子庙秦淮风光带',
        link: 'https://baike.baidu.com/item/%E5%A4%AB%E5%AD%90%E5%BA%99%E7%A7%A6%E6%B7%AE%E9%A3%8E%E5%85%89%E5%B8%A6/10475554?fr=aladdin'
      }]
    }
  },
  computed: {
    shipName: function() {
      return this.shipVideoInfo.shipName
    },
    shipStatus: function() {
      return this.shipVideoInfo.shipStatus
    },
    videoh: function() {
      if (!this.shipVideoInfo.shipCamheadUrl || this.shipVideoInfo.shipCamheadUrl === "") {
        return {
          url: "/",
          urlHD: "/"
        }
      } else {
        return {
          url: this.shipVideoInfo.shipCamheadUrl,
          urlHD: this.shipVideoInfo.shipCamheadUrlHD
        }
      }
    },
    videob: function() {
      if (!this.shipVideoInfo.shipCamcabinUrl || this.shipVideoInfo.shipCamcabinUrl === "") {
        return {
          url: "/",
          urlHD: "/"
        }
      } else {
        return {
          url: this.shipVideoInfo.shipCamheadUrl,
          urlHD: this.shipVideoInfo.shipCamheadUrlHD
        }
      }
    },
    videot: function() {
      if (!this.shipVideoInfo.shipCamtailUrl || this.shipVideoInfo.shipCamtailUrl === "") {
        return {
          url: "/",
          urlHD: "/"
        }
      } else {
        return {
          url: this.shipVideoInfo.shipCamheadUrl,
          urlHD: this.shipVideoInfo.shipCamheadUrlHD
        }
      }
    }
  },
  methods: {
    init() {
      this.playerh = this.$refs.playerh.dp
      this.playerb = this.$refs.playerb.dp
      this.playert = this.$refs.playert.dp
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