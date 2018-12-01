<template>
  <div id="map-card">
    <div class="map-title">{{shipInfo.shipName}}船位置</div>
    <div id="dashmap" class="map-content"></div>
  </div>
</template>
<script>
import AMap from 'AMap'
let dashmap = null // 全局首页地图变量
var dashmarker = null // 全局首页标记点变量
export default {
  name: 'map-card',
  props: {
    shipInfo: {
      shipName: '',
      runStatus: '',
      longitude: 118.789582,
      latitude: 32.019405
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
        center: [118.789582, 32.019405],
        zoom: 16
      })
      dashmap.plugin(['AMap.Scale'], function() {
        dashmap.addControl(new AMap.Scale())
      })
    },
    // 坐标标注函数
    dashaddMarker() {
      let lngLat = new AMap.LngLat(this.shipInfo.longitude, this.shipInfo.latitude) // 创建高德坐标对象
      // 转换坐标
      AMap.convertFrom(lngLat, 'gps', (status, result) => {
        if (result.info === 'ok') {
          lngLat = result.locations[0] // Array.<LngLat>
        } else {
          console.log("转换地图坐标失败")
        }
      })
      let iconUrl
      switch (this.shipInfo.runStatus) {
        case '0':
          iconUrl = '/static/img/ship_g.png'
          break
        case '1':
          iconUrl = '/static/img/ship_r.png'
          break
        case '2':
          iconUrl = '/static/img/ship_b.png'
          break
        default:
          iconUrl = '/static/img/ship_w.png'
          break
      }
      dashmap.setCenter(lngLat) // 移动地图中心点
      if (dashmarker !== null) {
        dashmarker.setIcon(iconUrl)
        dashmarker.setPosition(lngLat)
      } else {
        dashmarker = new AMap.Marker({
          icon: iconUrl, // 标注图标类型 <静态文件>
          position: lngLat, // 位置坐标
          map: dashmap
        })
      }
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
