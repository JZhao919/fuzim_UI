<template>
  <div id="map-card">
    <div class="map-title">{{shipInfo.shipName}}船位置</div>
    <div id="oneshipmap" class="map-content"></div>
  </div>
</template>
<script>
import { intToDate } from '@/utils/times'
import { initmap, drowTrack, clearTracks, clearMap } from './oneshiptrack.js'
export default {
  name: 'map-card',
  props: {
    shipInfo: {
      shipName: '',
      runStatus: '',
      longitude: 0,
      latitude: 0,
      gpsTime: '0'
    }
  },
  mounted() {
    initmap()
  },
  destroyed() {
    clearTracks()
    clearMap()
  },
  watch: {
    'shipInfo': 'dashaddMarker'
  },
  methods: {
    dashaddMarker() {
      let iconUrl = '/static/img/flag_b.png' // 默认是无色
      const gpsTime = this.shipInfo.gpsTime
      const nowdatetime = new Date().getTime()
      if (!gpsTime || gpsTime === "" || gpsTime === "0") {
        iconUrl = '/static/img/flag_b.png' // GPS时间为空--黑色
      } else if (!intToDate(gpsTime).getTime() || !nowdatetime) {
        iconUrl = '/static/img/flag_b.png'
      } else if (nowdatetime - intToDate(gpsTime).getTime() > 1800000) {
        iconUrl = '/static/img/flag_b.png' // GPS时间是半小时之前的--黑色
      } else {
        switch (this.shipInfo.runStatus) { // 半小时之内的GPS状态
          case '0':
            iconUrl = '/static/img/flag_g.png'
            break
          case '1':
            iconUrl = '/static/img/flag_lg.png'
            break
          case '2':
            iconUrl = '/static/img/flag_y.png'
            break
          case '3':
            iconUrl = '/static/img/flag_r.png'
            break
          default:
            break
        }
      }
      drowTrack(this.shipInfo.longitude, this.shipInfo.latitude, iconUrl)
    }
  }
}
</script>
<style scoped>
#map-card{
  padding: 5px;
  width: 100%;
}
#map-card .map-title{
  padding: 6px 10px;
  background-color: #eeeff1;
  height: 30px;
  text-align: center;
  font-size: 13px;
  line-height: 20px;
}
#map-card .map-content{
  padding: 10px;
  background-color: #ffffff;
  height: 440px;
  text-align: left;
  font-size: 13px;
  line-height: 20px;
  color: #303133;
}
</style>
