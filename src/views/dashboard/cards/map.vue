<template>
  <div id="map-card">
    <div class="map-title">{{shipInfo.shipId}}号船位置</div>
    <div id="fz-map" class="map-content"></div>
  </div>
</template>
<script>
import AMap from 'AMap'
let map // 全局地图变量
var marker // 全局定义地图和标记点变量
export default {
  name: 'map-card',
  props: {
    shipInfo: {
      shipId: 0,
      longitude: 0,
      latitude: 0,
      overSpeed: "",
      collide: "",
      ultrasonicValue: "0|0",
      leakage: "",
      overSmog: "",
      overFire: "",
      overMotor: "",
      batteryStatus: ""
    }
  },
  watch: {
    'shipInfo.shipId': 'addMarker'
  },
  mounted() {
    this.initmap()
  },
  methods: {
    // 地图初始化函数
    initmap() {
      map = new AMap.Map('fz-map', {
        center: [118.789582, 32.019405],
        zoom: 16
      })
      map.plugin(['AMap.Scale'], function() {
        map.addControl(new AMap.Scale())
      })
    },
    // 坐标标注函数
    addMarker() {
      const shipInfo = this.shipInfo
      let lngLat = new AMap.LngLat(shipInfo.longitude, shipInfo.latitude) // 创建高德坐标对象
      // 转换坐标
      AMap.convertFrom(lngLat, 'gps', (status, result) => {
        if (result.info === 'ok') {
          lngLat = result.locations[0] // Array.<LngLat>
          var iconUrl
          if (shipInfo.overSmog === '1' || shipInfo.overFire === '1' || shipInfo.leakage === '1' || shipInfo.overMotor === '1') {
            iconUrl = '/static/img/ship_r.png'
          } else if (shipInfo.collide === '1' || shipInfo.overSpeed === '1' || shipInfo.batteryStatus === '1') {
            iconUrl = '/static/img/ship_y.png'
          } else if (shipInfo.wait === '1') {
            iconUrl = '/static/img/ship_b.png'
          } else {
            iconUrl = '/static/img/ship_w.png'
          }
          if (marker) {
            marker.setMap(null)
            marker = null
          } // 清除标记点
          marker = new AMap.Marker({
            icon: iconUrl, // 标注图标类型 <静态文件>
            position: lngLat, // 位置坐标
            map: map
          })
          return
        } else {
          console.log("转换失败")
        }
      })
    }
  }
}
</script>
<style scoped>
#map-card{
  margin-bottom: 10px;
  padding: 10px;
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
