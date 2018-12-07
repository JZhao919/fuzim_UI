<template>
  <div id="map-card">
    <div class="map-title">{{shipInfo.shipName}}船位置</div>
    <div id="dashmap" class="map-content"></div>
  </div>
</template>
<script>
import AMap from 'AMap'
import GPS from '@/utils/GPS'
import { dateToInt } from '@/utils/times'
let dashmap = null // 全局首页地图变量
var dashmarker = null // 全局首页标记点变量
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
    this.initmap()
  },
  watch: {
    'shipInfo': 'dashaddMarker'
  },
  methods: {
    // 地图初始化函数
    initmap() {
      dashmap = new AMap.Map('dashmap', {
        mapStyle: 'amap://styles/12cb5f735c7e70f55c221548b0e11763', // 设置地图的显示样式
        center: [118.789279, 32.019657],
        zoom: 18,
        dragEnable: false,
        keyboardEnable: false,
        doubleClickZoom: false
      })
      dashmap.plugin(['AMap.Scale'], function() {
        dashmap.addControl(new AMap.Scale())
      })
    },
    // 坐标标注函数
    dashaddMarker() {
      let lngLat // 创建高德坐标对象
      if (this.shipInfo.longitude === 0 || this.shipInfo.latitude === 0) {
        lngLat = [118.789381, 32.019571]
      } else {
        lngLat = GPS.gcj_encrypt(this.shipInfo.longitude, this.shipInfo.latitude) // 转换坐标
      }
      let iconUrl = '/static/img/ship_w.png' // 默认是无色
      const gpsTime = this.shipInfo.gpsTime
      const nowdatetime = dateToInt(new Date())
      if (!gpsTime || gpsTime === "" || gpsTime === "0") {
        iconUrl = '/static/img/ship_b.png' // GPS时间为空--黑色
      } else if (nowdatetime - parseInt(gpsTime) > 2999) {
        iconUrl = '/static/img/ship_b.png' // GPS时间是半小时之前的--黑色
      } else {
        switch (this.shipInfo.runStatus) { // 半小时之内的GPS状态
          case '0':
            iconUrl = '/static/img/ship_g.png'
            break
          case '1':
            iconUrl = '/static/img/ship_lg.png'
            break
          case '2':
            iconUrl = '/static/img/ship_ly.png'
            break
          case '3':
            iconUrl = '/static/img/ship_r.png'
            break
          default:
            break
        }
      }
      dashmap.setCenter(lngLat) // 移动地图中心点
      if (dashmarker !== null) {
        dashmarker.setMap(null)
        dashmarker = null
      }
      dashmarker = new AMap.Marker({
        icon: iconUrl, // 标注图标类型 <静态文件>
        position: lngLat, // 位置坐标
        map: dashmap
      })
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
