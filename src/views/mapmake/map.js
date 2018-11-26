import AMap from 'AMap'
let makemap // 全局地图变量

// 刷新页面清楚标记点

// 地图初始化函数
export function initmap() {
  makemap = new AMap.Map('makemap', {
    center: [118.789582, 32.019405],
    zoom: 19
  })
  makemap.plugin(['AMap.ToolBar', 'AMap.Scale'], function() {
    makemap.addControl(new AMap.ToolBar())
    makemap.addControl(new AMap.Scale())
  })
}

// 坐标转换函数
export function transcode(allShipInfo) {
  // 转换坐标
  var num = allShipInfo.length
  if (num !== 0) {
    console.log("船只数:" + num)
    for (let i = 0; i < num; i++) {
      let lngLat = new AMap.LngLat(allShipInfo[i].longitude, allShipInfo[i].latitude) // 创建高德坐标对象
      // 转换坐标
      AMap.convertFrom(lngLat, 'gps', function(status, result) {
        if (result.info === 'ok') {
          lngLat = result.locations[0] // Array.<LngLat>
          // console.log(lngLat)
          addMarker(allShipInfo[i], lngLat) // 坐标点标注
        }
      })
    }
  }
  return
}

// 点标注函数
function addMarker(shipinfo, lnglat) {
  let iconUrl
  switch (shipinfo.runStatus) {
    case '0':
      iconUrl = '/static/img/ship_b.png'
      break
    case '1':
      iconUrl = '/static/img/ship_g.png'
      break
    case '2':
      iconUrl = '/static/img/ship_r.png'
      break
    default:
      iconUrl = '/static/img/ship_w.png'
      break
  }
  var marker = new AMap.Marker({
    icon: iconUrl, // 标注图标类型 <静态文件>
    position: lnglat, // 位置坐标
    title: "该游船的船号：" + shipinfo.shipId + "\n当前GPS坐标：N:" + shipinfo.latitude + "|E:" + shipinfo.longitude +
    "\n当前地磁偏角：" + shipinfo.gpsVardir + ":" + shipinfo.gpsMagvar + "\n当前航向角度：" + shipinfo.gpsTrackTure, // 鼠标滑过提示
    map: makemap
  })
  marker.setLabel({
    offset: new AMap.Pixel(-8, 10), // 修改label相对于maker的位置
    content: shipinfo.shipName
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
  var leftClickInfoWD = new AMap.InfoWindow({
    isCustom: true, // 使用自定义窗体
    closeWhenClickMap: true,
    offset: new AMap.Pixel(16, -55)
  })
  function markerClick(e) {
    leftClickInfoWD.setContent(e.target.content)
    leftClickInfoWD.open(makemap, e.target.getPosition())
  }
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
  makemap.clearInfoWindow() // 关闭信息窗体
}
