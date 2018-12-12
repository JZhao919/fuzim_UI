import AMap from 'AMap'
import AMapUI from 'AMapUI'
import GPS from '@/utils/GPS'
import { getAllGPSByIdTimeBetween } from "@/api/GPSinfo"
import { getOneShipInfoByTimeBetween } from '@/api/shipinfo'
import { Notification } from 'element-ui'
import { dateToInt, intToDate, timestampsToTime } from '@/utils/times'

let trailmap = null // 全局地图对象
let pathSimplifierIns = null // 全局简单轨迹线对象
let trackInfoNotification = null // 轨迹的信息窗口
let trailShipId = null // 查询轨迹的船只编号
let selectStartTime = null // 查询轨迹开始运行时间
let selectEndTime = null // 查询结轨迹束运行时间
let startRunTime = null // 轨迹真实开始运行时间
let endRunTime = null // 轨迹真实结束运行时间

let trailIoTimes = 2 // 尝试循环获取ioTimes的最大次数
// 地图初始化函数
export function initMap() {
  if (trailmap !== null) {
    trailmap = null
  }
  trailmap = new AMap.Map('trailmap', {
    mapStyle: 'amap://styles/12cb5f735c7e70f55c221548b0e11763', // 设置地图的显示样式
    center: [118.789582, 32.019405],
    zoom: 15,
    // dragEnable: false,
    keyboardEnable: false,
    doubleClickZoom: false
  })
  trailmap.plugin(['AMap.Scale'], () => {
    trailmap.addControl(new AMap.Scale())
  })
}

/**
 * 坐标获取与数量处理与坐标系转换
 * @param number shipId
 * @param number startTime
 * @param number endTime
 * @return Promise Array.<AMap.LngLat> gps
 */
export function getlngLats(shipId, startTime, endTime) {
  trailShipId = shipId // 初始化查询船只
  selectStartTime = startTime
  selectEndTime = endTime // 初始化查询时间
  return new Promise((resolve, rejects) => {
    getAllGPSByIdTimeBetween(shipId, dateToInt(startTime), dateToInt(endTime)).then(response => {
      const gps = [] // 处理后的坐标组
      const data = response.data // 返回的坐标数据
      const gpslength = data.length
      if (!data || data === null || gpslength <= 0) {
        resolve(gps) // 返回空数组
      } else {
        startRunTime = data[gpslength - 1].gpsTime // 获取该段时间内的船只开始时间
        endRunTime = data[0].gpsTime // 获取该段时间内的船只结束时间
        if (gpslength > 1000) {
          const jump = parseInt(gpslength / 1000)
          for (let i = gpslength - 1; i >= 0; i -= jump) {
            if (data[i].longitude && data[i].longitude !== 0 && data[i].latitude && data[i].latitude !== 0) {
              gps.push(GPS.gcj_encrypt(data[i].longitude, data[i].latitude))
            }
          }
        } else {
          for (let i = gpslength - 1; i >= 0; i--) {
            if (data[i].longitude && data[i].longitude !== 0 && data[i].latitude && data[i].latitude !== 0) {
              gps.push(GPS.gcj_encrypt(data[i].longitude, data[i].latitude))
            }
          }
        }
        resolve(gps)
        return
      }
    }).catch(errer => {
      rejects('获取数据错误：' + errer)
    })
  })
}

/**
 * 轨迹绘制函数
 * @param Array.<AMap.LngLat>||AMap.LngLat lngLats
 */
export function initTrack(lngLats) {
  AMapUI.load(['ui/misc/PathSimplifier', 'lib/$', 'lib/utils'], function(PathSimplifier, $, utils) {
    if (!PathSimplifier.supportCanvas) {
      alert('当前环境不支持 Canvas！')
      return
    }
    initPage(PathSimplifier)
  })
  // 轨迹线的样式
  var defaultRenderOptions = {
    renderAllPointsIfNumberBelow: 100, // 绘制路线节点，如不需要可设置为-1
    pathNavigatorStyle: {
      initRotateDegree: 0,
      width: 16,
      height: 16,
      autoRotate: true,
      lineJoin: "round",
      content: "defaultPathNavigator",
      fillStyle: "#fff000",
      strokeStyle: "#ff0000",
      lineWidth: 1,
      pathLinePassedStyle: {
        lineWidth: 2,
        strokeStyle: "#ff0000",
        borderWidth: 1,
        borderStyle: "#ffc200",
        dirArrowStyle: true
      }
    }
  }
  function initPage(PathSimplifier) {
    // 创建组件实例
    if (pathSimplifierIns !== null) {
      pathSimplifierIns.clearPathNavigators()
      pathSimplifierIns.setData(null)
      pathSimplifierIns = null
    }
    pathSimplifierIns = new PathSimplifier({
      zIndex: 100,
      // autoSetFitView:false,
      map: trailmap, // 所属的地图实例
      getPath: function(pathData, pathIndex) {
        // 返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
        return pathData.path
      },
      getHoverTitle: function(pathData, pathIndex, pointIndex) {
        // 返回鼠标悬停时显示的信息
        if (pointIndex >= 0) {
          return pathData.name + '，当前点：' + pointIndex + '/' + pathData.path.length // 鼠标悬停在某个轨迹节点上
        }
        // 鼠标悬停在节点之间的连线上
        return pathData.name + '，点数量：' + pathData.path.length + '，播放速度：300km/h'
      },
      renderOptions: defaultRenderOptions,
      // 设置数据构建一条简单的轨迹
      data: [{
        name: '船只的运行轨迹',
        path: lngLats
      }]
    })
    // 创建一个巡航器，关联第1条轨迹（轨迹1）
    var navg = pathSimplifierIns.createPathNavigator(0, {
      loop: true, // 循环播放
      speed: 300 // 巡航速度，单位千米/小时
    })
    navg.start()
    pathSimplifierIns.on('pathClick pointClick', () => {
      if (trackInfoNotification !== null) {
        trackInfoNotification.close()
        trackInfoNotification = null
      }
      trackInfo()
    })
  }
}

// 轨迹介绍
function trackInfo() {
  let trailIoTimes1 = null
  let trailIoTimes2 = null
  trailIoTimes-- // 尝试次数减一
  getOneShipInfoByTimeBetween(trailShipId, startRunTime, startRunTime)
    .then((response) => {
      const data = response.data // 返回的数据
      if (data && data !== null) {
        trailIoTimes1 = data[0].ioTimes
      }
    })
    .then(() => {
      getOneShipInfoByTimeBetween(trailShipId, endRunTime, endRunTime)
        .then((response) => {
          const data = response.data // 返回的数据
          if (data && data !== null) {
            trailIoTimes2 = data[0].ioTimes
          }
          if (trailIoTimes1 !== null && trailIoTimes2 !== null) {
            var ioTimes = Number(trailIoTimes2) - Number(trailIoTimes1)
            if (ioTimes === 0) {
              initTrackInfoWid('1趟未完')
            } else {
              initTrackInfoWid(ioTimes + '趟')
            }
            return
          } else {
            if (trailIoTimes > 0) {
              trackInfo()
            } else {
              initTrackInfoWid('查询失败')
              return
            }
          }
        }).catch(errer => {
          trailIoTimes2 = null
        })
    })
    .catch(errer => {
      trailIoTimes1 = null
    })
}

// 实例化轨迹弹出信息窗口
function initTrackInfoWid(ioTimes) {
  return new Promise((resolve, rejects) => {
    const allSelctTime = selectEndTime.getTime() - selectStartTime.getTime() // 选择的总时间毫秒
    const allRunTime = intToDate(endRunTime).getTime() - intToDate(startRunTime).getTime() // 运行总时间毫秒
    const allStopTime = allSelctTime - allRunTime // 停止总时间毫秒
    const htmlMSG = '<p>运行趟数：' + ioTimes + '</p><p>运行总时间：' + timestampsToTime(allRunTime) + '</p><p>在码头停留时间：' + timestampsToTime(allStopTime) + '</p>'
    const title = '在' + timestampsToTime(allSelctTime) + '内的轨迹信息：'
    trackInfoNotification = Notification({
      title: title,
      dangerouslyUseHTMLString: true,
      message: htmlMSG,
      duration: 0,
      position: 'top-right',
      offset: 100
    })
  })
}

// 清楚轨迹信息窗口
export function clearTrackInfoWid() {
  if (trackInfoNotification !== null) {
    trackInfoNotification.close()
    trackInfoNotification = null
  }
}
// 清楚轨迹
export function clearTrack() {
  // console.log(123)
  if (pathSimplifierIns !== null) {
    pathSimplifierIns.clearPathNavigators()
    pathSimplifierIns.setData(null)
    pathSimplifierIns = null
  }
}
