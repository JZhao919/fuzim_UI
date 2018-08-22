<template>
  <el-row id="fz-video">
    <el-col v-for="vd in shipDefInfos" :key="vd.shipId" :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
      <myplayer :shipVideoInfo="vd"></myplayer>
    </el-col>
  </el-row>
</template>

<script>
import myplayer from './myPlayer'
export default {
  name: 'fz-video',
  components: {
    myplayer
  },
  data() {
    return {
      shipDefInfos: [{
        shipId: 0,
        shipName: 'AAA',
        shipNote: '',
        shipStatus: '0',
        url: 'http://hls.open.ys7.com/openlive/fcd217df57fe4caea308203e110605bf.hd.m3u8',
        urlHD: 'http://hls.open.ys7.com/openlive/fcd217df57fe4caea308203e110605bf.hd.m3u8',
        pic: 'http://static.smartisanos.cn/pr/img/video/video_03_cc87ce5bdb.jpg'
      },
      {
        shipId: 0,
        shipName: 'BBB',
        shipNote: '',
        shipStatus: '1',
        url: 'http://hls.open.ys7.com/openlive/fcd217df57fe4caea308203e110605bf.hd.m3u8',
        urlHD: 'http://hls.open.ys7.com/openlive/fcd217df57fe4caea308203e110605bf.hd.m3u8',
        pic: 'http://static.smartisanos.cn/pr/img/video/video_03_cc87ce5bdb.jpg'
      },
      {
        shipId: 0,
        shipName: 'CCC',
        shipNote: '',
        shipStatus: '1',
        url: 'http://hls.open.ys7.com/openlive/fcd217df57fe4caea308203e110605bf.hd.m3u8',
        urlHD: 'http://hls.open.ys7.com/openlive/fcd217df57fe4caea308203e110605bf.hd.m3u8',
        pic: 'http://static.smartisanos.cn/pr/img/video/video_03_cc87ce5bdb.jpg'
      },
      {
        shipId: 0,
        shipName: 'DDD',
        shipNote: '',
        shipStatus: '0',
        url: 'http://hls.open.ys7.com/openlive/fcd217df57fe4caea308203e110605bf.hd.m3u8',
        urlHD: 'http://hls.open.ys7.com/openlive/fcd217df57fe4caea308203e110605bf.hd.m3u8',
        pic: 'http://static.smartisanos.cn/pr/img/video/video_03_cc87ce5bdb.jpg'
      }]
    }
  }
}
</script>

<style scoped>
#fz-video{
  padding: 0 4px;
}
</style>
