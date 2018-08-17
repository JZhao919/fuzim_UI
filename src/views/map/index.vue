 /* eslint-disable */
<template>
  <el-row>
    <el-col :span="24">
      <el-card id="map" class="fz-box">
        
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import AMap from 'AMap'
let fzmap // 全局地图
const axios = require('axios')
export default {
  name: 'map',
  data() {
    return {
      allShipInfo: [
        {
          // 状态信息
          'shipId': 1,
          'ioTimes': 1,
          'runStatus': '1',
          'startRunTime': 20180114123456,
          'endRunTime': 20180114133456,
          'runTime': 3600,
          'wait': '0',
          'speed': 0.604,
          // 警告信息
          "overSpeed": "0",
          "collide": "0",
          "ultrasonicValue": "1000|999",
          "leakage": "0",
          "overSmog": "0",
          "overFire": "0",
          "overMotor": "0",
          "batteryStatus": "0",
          // GPS信息
          "gpsTime": 20180114133458,
          "gpsLondir": "E",
          "longitude": 11843.85207,
          "gpsLatdir": "N",
          "latitude": 3202.26643,
          "gpsVardir": "E",
          "gpsMagvar": 0.0,
          "gpsTrackTure": 108.5,
          "gpsModeInd": "A",
          // 电池信息
          "batterySOC": "0",
          "batteryTotalVolt": "0",
          "batteryTotalCurr": "0",
          "batteryTotalRP": "0",
          "batteryTotalRN": "0",
          "batteryMaxVoltSN": "0",
          "batteryMaxVolt": "0",
          "batteryMinVoltSN": "0",
          "batteryMinVolt": "0",
          "batteryMaxTEMPSN": "0",
          "batteryMaxTEMP": "0",
          "batteryMinTEMPSN": "0",
          "batteryMinTEMP": "0",
          // 电机与雷达
          "radarRange": "20",
          "radarAzimuth": "30",
          "radarVerl": "2",
          "radarSNR": "60",
          "motorCurrent1": 5,
          "motorVoltage1": 24,
          "motorSpeed1": 3000,
          "motorCurrent2": 5,
          "motorVoltage2": 24,
          "motorSpeed2": 3000,
          "hardware": "note01"
        }
      ] // 所有船只全部信息
    }
  },

  mounted() {
    this.initmap()
    this.infoget()
  },
  methods: {
    // 消息通知函数
    notification(index) {
      switch (index) {
        case 1:
          this.$notify({
            title: '成功！',
            message: '成功获取远程数据！',
            type: 'success'
          })
          break
        case 2:
          this.$notify.error({
            title: '超时错误！',
            message: '获取远程数据失败！'
          })
          break
        default:
      }
    },
    // 地图初始化函数
    initmap() {
      fzmap = new AMap.Map('map', {
        center: [118.789582, 32.019405],
        zoom: 19
      })
      fzmap.plugin(['AMap.ToolBar', 'AMap.Scale'], function() {
        fzmap.addControl(new AMap.ToolBar())
        fzmap.addControl(new AMap.Scale())
      })
    },
    // 数据拉取+坐标转换函数
    infoget() {
      var _this = this
      axios.get("http://faultest.com:8080/templefuzi/shipInfo/getAllShipInfo")
        .then(function(response) {
          // handle success
          _this.allShipInfo = response.data.data
          _this.notification(1)
          // 转换坐标
          var num = _this.allShipInfo.length
          if (num !== 0) {
            console.log("数据个数:" + num)
            for (var i = 0; i < num; i++) {
              (function(i) {
                let lngLat = new AMap.LngLat(_this.allShipInfo[i].longitude / 100, _this.allShipInfo[i].latitude / 100) // 创建高德坐标对象
                // 转换坐标
                AMap.convertFrom(lngLat, 'gps', function(status, result) {
                  if (result.info === 'ok') {
                    lngLat = result.locations[0] // Array.<LngLat>
                    _this.addMarker(_this.allShipInfo[i], lngLat) // 坐标标注
                  }
                })
              })(i)
            }
          }
        })
        .catch(function(errer) {
          // handle errer
          console.log(errer)
          _this.notification(2)
        })
    },
    // 标注函数
    addMarker(shipinfo, lnglat) {
      var iconUrl
      if (shipinfo.overSmog === '1' || shipinfo.overFire === '1' || shipinfo.leakage === '1' || shipinfo.overMotor === '1') {
        iconUrl = '/static/img/ship_r.png'
      } else if (shipinfo.collide === '1' || shipinfo.overSpeed === '1' || shipinfo.batteryStatus === '1') {
        iconUrl = '/static/img/ship_y.png'
      } else if (shipinfo.wait === '1') {
        iconUrl = '/static/img/ship_b.png'
      } else {
        iconUrl = '/static/img/ship_w.png'
      }
      var marker = new AMap.Marker({
        icon: iconUrl, // 标注图标类型 <静态文件>
        position: lnglat, // 位置坐标
        title: "该游船的船号：" + shipinfo.shipId + "\n当前GPS坐标：N:" + shipinfo.latitude + "|E:" + shipinfo.longitude +
        "\n当前地磁偏角：" + shipinfo.gpsVardir + ":" + shipinfo.gpsMagvar + "\n当前航向角度：" + shipinfo.gpsTrackTure, // 鼠标滑过提示
        map: fzmap
      })
      marker.setLabel({
        offset: new AMap.Pixel(5, -22), // 修改label相对于maker的位置
        content: shipinfo.shipId
      })
      // 实例化鼠标点击信息窗体
      var lclickIFWDT = []
      var lclickIFWDC = [] // 点击弹出窗口内容
      lclickIFWDT = "<span style=\"font-size:14px;color: #000000;\">" + shipinfo.shipId + '号船的警告信息如下：' + "</span>"// 点击弹出窗口标题
      lclickIFWDC.push("船只运行时间：" + shipinfo.runTime + "<br/>上次停止时刻：" + shipinfo.endRunTime + "<br/>上次启动时刻：" + shipinfo.startRunTime)
      lclickIFWDC.push("<br/>烟雾警报：" + shipinfo.overSmog + ",<br/>火光警报：" + shipinfo.overFire + ",<br/>漏水警报：" + shipinfo.leakage)
      lclickIFWDC.push("<br/>撞船警报：" + shipinfo.collide + " ---> 船距：" + shipinfo.ultrasonicValue)
      lclickIFWDC.push("<br/>超速警报：" + shipinfo.overSpeed + " ---> 船速：" + shipinfo.speed)
      lclickIFWDC.push("<br/>电机警报：" + shipinfo.overMotor + "<br/>转速：" + shipinfo.motorSpeed1 + "|" + shipinfo.motorSpeed2 +
       "|电流：" + shipinfo.motorCurrent1 + "|" + shipinfo.motorCurrent2 + "|电压：" + shipinfo.motorVoltage1 + "|" + shipinfo.motorVoltage2)
      lclickIFWDC.push("<br/>电池警报：" + shipinfo.batteryStatus)
      marker.content = createInfoWindow(lclickIFWDT, lclickIFWDC) // 构造信息窗体
      marker.on('click', markerClick) // 设置标注点击事件
      // marker.emit('click',{target:marker});  // 默认打开一个标注事件
      var leftClickInfoWD = new AMap.InfoWindow({
        isCustom: true, // 使用自定义窗体
        closeWhenClickMap: true,
        offset: new AMap.Pixel(16, -55)
      })
      function markerClick(e) {
        leftClickInfoWD.setContent(e.target.content)
        leftClickInfoWD.open(fzmap, e.target.getPosition())
      }
      // 构建自定义信息窗体函数
      function createInfoWindow(title, content) {
        var info = document.createElement("div")
        info.style = "border: solid 1px silver;"
        // 可以通过下面的方式修改自定义窗体的宽高
        info.style.width = "240px"
        var top = document.createElement("div") // 定义顶部标题
        top.style = "position: relative;background: #F9F9F9;border-bottom: 1px solid #CCC;border-radius: 5px 5px 0 0;"
        var titleD = document.createElement("div")
        titleD.style = "display: inline-block;color: #333333;font-size: 14px;font-weight: bold;line-height: 31px;padding: 0 10px;"
        var closeX = document.createElement("img")
        closeX.style = "position: absolute;top: 10px;right: 10px;transition-duration: 0.25s;"
        titleD.innerHTML = title
        closeX.src = "https://webapi.amap.com/images/close2.gif"
        closeX.onclick = closeInfoWindow
        top.appendChild(titleD)
        top.appendChild(closeX)
        info.appendChild(top)
        var middle = document.createElement("div") // 定义中部内容
        middle.style = "text-align:left;font-size: 12px;padding: 6px;line-height: 20px;color:#000000;background:#f7f7f7"
        middle.innerHTML = content
        info.appendChild(middle)
        return info
      }
      function closeInfoWindow() {
        fzmap.clearInfoWindow() // 关闭信息窗体
      }
    }
  }
}
</script>

<style scoped>
  .fz-box {
    display: -webkit-flex;
    display: flex;
    flex-direction: column; /*主轴为纵轴*/
    justify-content:flex-start; /*主轴自上而下*/
    align-content: center; /*交叉轴中心对其*/
    margin: 2px;
    border: solid 2px #f7f7f7;
    padding: 0px;
    height: 710px;
    text-align: center;
    font-size: 80%;
    color: #606266
  };

</style>
