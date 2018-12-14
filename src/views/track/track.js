import AMap from 'AMap'
import AMapUI from 'AMapUI'
import GPS from '@/utils/GPS'
import { getOneShipInfoByTimeBetween } from '@/api/shipinfo'
import { Notification } from 'element-ui'
import { dateToInt, intToDate, timestampsToTime } from '@/utils/times'

let trailmap = null // 全局地图对象
let pathSimplifierIns = null // 全局简单轨迹线对象
let trackInfoNotification = null // 轨迹的信息窗口

let selectStartTime = null // 查询轨迹开始运行时间
let selectEndTime = null // 查询结轨迹束运行时间
let runPoints = [] // 运行时间节点对象的集合
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
  selectStartTime = startTime
  selectEndTime = endTime // 初始化查询时间
  return new Promise((resolve, rejects) => {
    getOneShipInfoByTimeBetween(shipId, dateToInt(startTime), dateToInt(endTime)).then(response => {
      const gps = [] // 处理后的坐标组
      const data = response.data // 返回的坐标数据
      const gpslength = data.length
      if (!data || data === null || gpslength <= 0) {
        resolve(gps) // 返回空数组
      } else {
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
        if (runPoints.length !== 0) {
          runPoints = []
        }
        countRunNums(data, gpslength - 1, 0, runPoints)
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
export function trackInfo() {
  const allSelctTime = selectEndTime.getTime() - selectStartTime.getTime() // 选择的总时间毫秒
  const runInfo = countRunTime(runPoints, allSelctTime)
  initTrackInfoWid(runInfo, allSelctTime)
}

// 实例化轨迹弹出信息窗口
function initTrackInfoWid(runInfo, allSelctTime) {
  let htmlMSG
  if (runInfo.halfCount !== 0) {
    htmlMSG = '<p>运行趟数：' + runInfo.count + '整趟,' + runInfo.halfCount + '个半趟</p><p>运行总时间：' + timestampsToTime(runInfo.runTime) + '</p><p>在码头停留时间：' + timestampsToTime(runInfo.stopTime) + '</p>'
  } else {
    htmlMSG = '<p>运行趟数：' + runInfo.count + '整趟</p><p>运行总时间：' + timestampsToTime(runInfo.runTime) + '</p><p>在码头停留时间：' + timestampsToTime(runInfo.stopTime) + '</p>'
  }
  const title = '在' + timestampsToTime(allSelctTime) + '内的轨迹信息：'
  trackInfoNotification = Notification({
    title: title,
    dangerouslyUseHTMLString: true,
    message: htmlMSG,
    duration: 0,
    position: 'top-right',
    offset: 100
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

/**
 * 计算运行次数 runPoints集合的长度即代表运行次数
 * @param {Array} list 数据列表
 * @param {Number} sd 循环查询列表的起始点 初始为list.length - 1
 * @param {Number} ed 循环查询列表的结束点 默认为0
 * @param {Array} runPoints 运行时间节点对象的集合
 * @returns {Array|[{runPoint}]} runPoints 运行时间节点对象的集合,每个对象包含每次起止时间和是否完成属性
 */
export function countRunNums(list, sd, ed, runPoints) {
  if (sd === ed) {
    return
  }
  let nsd = sd // 下一次查询的起始位置
  // 运行时间节点对象
  const runPoint = {
    flag: null, // 标志位表明是否运行完: 0:没有 1:完成
    startPoint: null,
    endPoint: null
  }
  // 起始点数据显示运行中
  if (list[sd].endRunTime === '0') {
    if (intToDate(list[sd].gpsTime).getTime - list[sd].startRunTime.getTime < 20000) {
      runPoint.startPoint = list[sd].startRunTime
    } else {
      runPoint.startPoint = intToDate(list[sd].gpsTime) // 第1点就正在运行则用该条数据的gps时间代替;注意转换数据格式
      runPoint.flag = 0
    }
    // 寻找运行的结束时间点
    for (let i = sd - 1; i >= ed; i--) {
      if (list[i].endRunTime !== '0') { // endRunTime !== 0 表示运行停止
        runPoint.endPoint = list[i].endRunTime // 获取运行的结束时间点
        if (runPoint.flag !== 0) {
          runPoint.flag = 1
        }
        runPoints.push(runPoint) // 收录运行节点
        nsd = i
        break
      }
      if (i === ed && list[ed].endRunTime === '0') { // 遍历完数据仍没有结束运行
        runPoint.flag = 0
        runPoint.endPoint = intToDate(list[ed].gpsTime) // 用该条数据的gps时间代替;注意转换数据格式
        runPoints.push(runPoint) // 收录运行节点
      }
    }
    if (nsd > ed) { // 递归运行下一次查询
      countRunNums(list, nsd, ed)
    }
  } else { // 起始点数据未运行
    // 寻找第一次开始运行的点
    for (let i = sd - 1; i >= ed; i--) {
      if (i === ed && list[ed].endRunTime !== '0') { // 遍历完数据仍没有开始运行 即该段数据全是未运行
        return
      }
      if (list[i].endRunTime === '0') {
        runPoint.startPoint = list[sd].startRunTime // 获取运行的开始时间点
        nsd = i
        break
      }
    }
    if (nsd <= ed) { // 最后一条数据为开始点则不收录不再寻找结束点
      return
    }
    // 寻找运行的结束时间点
    for (let i = nsd - 1; i >= ed; i--) {
      if (list[i].endRunTime !== '0') { // endRunTime !== 0 表示运行停止
        runPoint.endPoint = list[i].endRunTime // 获取运行的结束时间点
        runPoint.flag = 1
        runPoints.push(runPoint) // 收录运行节点
        nsd = i
        break
      }
      if (i === ed && list[ed].endRunTime === '0') { // 遍历完数据仍没有结束运行
        runPoint.flag = 0
        runPoint.endPoint = intToDate(list[ed].gpsTime) // 用该条数据的gps时间代替;注意转换数据格式
        runPoints.push(runPoint) // 收录运行节点
      }
    }
    if (nsd > ed) {
      countRunNums(list, nsd, ed)
    }
  }
  return runPoints
}

/**
 * 计算运行时间
 * @param {Array} runPoints 运行时间节点对象的集合
 * @param {timestamps} seletTime 用户选择的时间长度时间长度毫秒
 * @returns {runInfo} runInfo 运行信息对象{次数，半次数，运行时间，停止时间}
 */
export function countRunTime(runPoints, seletTime) {
  // 运行次数集合为空则返回：运行次数为0,运行时间为0
  const length = runPoints.length
  const runInfo = {
    halfCount: 0,
    count: 0,
    runTime: 0,
    stopTime: 0
  }
  if (length === 0) {
    return runInfo
  }
  for (let i = 0; i < length; i++) {
    const runPoint = runPoints[i]
    if (runPoint.startPoint !== null && runPoint.endPoint !== null) {
      var endT = new Date(runPoint.endPoint).getTime()
      var strT = new Date(runPoint.startPoint).getTime()
      runInfo.runTime = runInfo.runTime + (endT - strT)
      if (runPoint.flag === 1) {
        runInfo.count++
      } else {
        runInfo.halfCount++
      }
    }
  }
  runInfo.stopTime = seletTime - runInfo.runTime
  return runInfo
}
