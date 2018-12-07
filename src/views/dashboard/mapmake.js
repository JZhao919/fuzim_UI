import AMap from 'AMap'
import AMapUI from 'AMapUI'
import GPS from '@/utils/GPS'
let nowdatetime = null
let makemap = null // 全局地图变量
let markerList = null // 全局标点列表

// 地图初始化函数
export function initmap() {
  if (makemap !== null) {
    makemap = null
  }
  makemap = new AMap.Map('makemap', {
    mapStyle: 'amap://styles/12cb5f735c7e70f55c221548b0e11763', // 设置地图的显示样式
    center: [118.789582, 32.019405],
    zoom: 17,
    dragEnable: false,
    keyboardEnable: false,
    doubleClickZoom: false
  })
  makemap.plugin(['AMap.ToolBar', 'AMap.Scale'], function() {
    makemap.addControl(new AMap.ToolBar())
    makemap.addControl(new AMap.Scale())
  })
}

function initMaker(MarkerData) {
  // 加载MarkerList，loadUI的路径参数为模块名中 'ui/' 之后的部分
  AMapUI.loadUI(['misc/MarkerList'], function(MarkerList) {
    // 启动页面
    initPage(MarkerList, MarkerData)
  })
}

function initPage(MarkerList, MarkerData) {
  // 创建一个实例
  if (markerList !== null) {
    markerList.clearData()
    markerList.clearRecycle()
    markerList = null
  }
  markerList = new MarkerList({
    map: makemap, // 关联的map对象
    // listContainer: 'markerlist', // 列表的dom容器的节点或者id, 用于放置getListElement返回的内容
    getDataId: function(dataItem, index) {
      // 返回数据项的Id
      return index
    },
    getPosition: function(dataItem) {
      // 返回数据项的经纬度，AMap.LngLat实例或者经纬度数组
      if (dataItem.longitude === 0 || dataItem.latitude === 0) {
        return [118.789381, 32.019571]
      } else {
        const LngLat = GPS.gcj_encrypt(dataItem.longitude, dataItem.latitude)
        // console.log(LngLat)
        return LngLat
      }
    },
    getMarker: function(dataItem, context, recycledMarker) {
      let iconUrl = '/static/img/ship_w.png' // 默认是无色
      if (!dataItem.gpsTime || dataItem.gpsTime === "" || dataItem.gpsTime === "0") {
        iconUrl = '/static/img/ship_b.png' // GPS时间为空--黑色
      } else if (nowdatetime - parseInt(dataItem.gpsTime) > 2999) {
        iconUrl = '/static/img/ship_b.png' // GPS时间是半小时之前的--黑色
      } else {
        switch (dataItem.runStatus) { // 半小时之内的GPS状态
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
      const label = {
        offset: new AMap.Pixel(-4, 10),
        content: dataItem.shipName
      }
      const title = dataItem.shipName + "的GPS信息：\n当前坐标为：N:" + dataItem.latitude + "|E:" + dataItem.longitude + "\n当前磁偏角：" + dataItem.gpsVardir + ":" + dataItem.gpsMagvar + "\n当前航向角：" + dataItem.gpsTrackTure
      if (recycledMarker) {
        // 存在可回收利用的marker,直接setLabel返回
        recycledMarker.setTitle(title)
        recycledMarker.setLabel(label)
        recycledMarker.setIcon(iconUrl)
        recycledMarker.setAnimation('AMAP_ANIMATION_DROP') // 标点下落动态
        return recycledMarker
      }
      // 返回一个新的Marker
      return new AMap.Marker({
        animation: 'AMAP_ANIMATION_DROP',
        title: title,
        label: label,
        icon: iconUrl
      })
    },
    getInfoWindow: function(dataItem, context, recycledInfoWindow) {
      // 点击弹出窗口标题
      var InfoWdT = "<span style=\"font-size:14px;color: #000000;\">" + dataItem.shipName + '船的警告信息如下：' + "</span>"
      // 点击弹出窗口内容
      var InfoWdC = "船只运行时间：" + dataItem.runTime + "<br/>上次停止时刻：" + dataItem.endRunTime + "<br/>上次启动时刻：" + dataItem.startRunTime +
        "<br/>烟雾警报：" + dataItem.overSmog + ",<br/>火光警报：" + dataItem.overFire + ",<br/>漏水警报：" + dataItem.leakage +
        "<br/>撞船警报：" + dataItem.collide + " ===> 船距：" + dataItem.ultrasonicValue +
        "<br/>超速警报：" + dataItem.overSpeed + " ===> 船速：" + dataItem.speed +
        "<br/>电机警报：" + dataItem.overMotor + "<br/>转速：" + dataItem.motorSpeed1 + "|" + dataItem.motorSpeed2 +
        "<br/>电流：" + dataItem.motorCurrent1 + "|" + dataItem.motorCurrent2 + "<br/>电压：" + dataItem.motorVoltage1 + "|" + dataItem.motorVoltage2 +
        "<br/>电池警报：" + dataItem.batteryStatus
      var content = createInfoWindow(InfoWdT, InfoWdC) // 构造信息窗体内容
      if (recycledInfoWindow) {
        // 存在可回收利用的infoWindow, 直接setContent返回
        recycledInfoWindow.setContent(content)
        return recycledInfoWindow
      }
      // 返回一个新的InfoWindow
      return new AMap.InfoWindow({
        isCustom: true, // 使用自定义窗体
        closeWhenClickMap: true,
        offset: new AMap.Pixel(0, -36),
        content: content
      })
    }
  })
  // markerList.on('selectedChanged', function(event, info) {}) // 监听选中改变
  // markerList.on('markerClick', function(event, record) {})   // 监听Marker上的点击，详见markerEvents
  markerList.render(MarkerData) // 绘制数据源，Let's go!
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
  titleD.style = "display: inline-block;color: #000000;font-size: 14px;font-weight: bold;line-height: 31px;padding: 0 10px;"
  var closeX = document.createElement("img")
  closeX.style = "position: absolute;top: 10px;right: 10px;transition-duration: 0.25s;"
  titleD.innerHTML = title
  closeX.src = "https://webapi.amap.com/images/close2.gif"
  closeX.onclick = closeInfoWindow
  top.appendChild(titleD)
  top.appendChild(closeX)
  info.appendChild(top)
  var middle = document.createElement("div") // 定义中部内容
  middle.style = "text-align:left;font-size: 12px;padding: 6px;line-height: 20px;color:#333333;background:#f7f7f7"
  middle.innerHTML = content
  info.appendChild(middle)
  return info
}
// 关闭信息窗体
function closeInfoWindow() {
  makemap.clearInfoWindow()
}
// 初始和更新marker数据
export function upDataMarker(data, datetime) {
  nowdatetime = datetime
  if (markerList === null) {
    initMaker(data)
  } else {
    markerList.render([]) // 清除数据
    // markerList.clearData()
    markerList.render(data) // 绘制数据
    markerList.clearRecycle()
  }
}
// 清楚全部标点
export function clearAllMarker() {
  markerList.clearRecycle()
  markerList.clearData()
  markerList = null
}
