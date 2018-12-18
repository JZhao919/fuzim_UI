import AMap from 'AMap'
import AMapUI from 'AMapUI'
import GPS from '@/utils/GPS'
import { getOneShipInfoByTimeBetween } from '@/api/shipinfo'
import { Notification, Message, Loading } from 'element-ui'
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
  const loadingInstance = Loading.service({
    fullscreen: true,
    lock: true,
    text: '正在获取坐标数据，请稍候...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.8)'
  })
  loadingInstance
  selectStartTime = startTime
  selectEndTime = endTime // 初始化查询时间
  if (runPoints.length > 0) {
    runPoints = []
  }
  return new Promise((resolve, rejects) => {
    getOneShipInfoByTimeBetween(shipId, dateToInt(startTime), dateToInt(endTime)).then(response => {
      const tracks = [] // 处理后的轨迹对象集合
      const data = response.data // 返回的坐标数据
      // console.log(data)
      if (!data || data === null || data.length <= 0) {
        resolve(tracks) // 返回空轨迹对象集合
      } else {
        countRunNums(data, data.length - 1, 0) // 计算返回数据集合含有多少趟运行数据 结果存在runPoints[]中
        // console.log(runPoints)
        if (runPoints.length === 0) {
          resolve(tracks) // 返回空数组
        } else {
          var gpslength, startID, endID
          for (let i = 0; i < runPoints.length; i++) {
            startID = runPoints[i].startID
            endID = runPoints[i].endID
            gpslength = startID - endID
            // console.log(gpslength)
            const gps = [] // 轨迹中坐标数据
            if (gpslength > 400) {
              const jump = parseInt(gpslength / 400 + 1)
              for (let j = startID; j >= endID; j -= jump) {
                if (data[j].longitude && data[j].longitude !== 0 && data[j].latitude && data[j].latitude !== 0) {
                  gps.push(GPS.gcj_encrypt(data[j].longitude, data[j].latitude))
                }
              }
            } else {
              for (let j = startID; j >= endID; j--) {
                // console.log(data[j].longitude)
                if (data[j].longitude && data[j].longitude !== 0 && data[j].latitude && data[j].latitude !== 0) {
                  gps.push(GPS.gcj_encrypt(data[j].longitude, data[j].latitude))
                }
              }
            }
            var track = {
              name: '第' + (i + 1) + '条轨迹',
              path: gps
            }
            // console.log(track)
            tracks.push(track)
          }
          resolve(tracks)
        }
      }
      loadingInstance.close()
      return
    }).catch(error => {
      loadingInstance.close()
      Message({
        message: '获取数据超时，请缩短查询时间。',
        duration: 3000,
        type: 'error',
        showClose: true
      })
      rejects('获取数据错误：' + error)
    })
  })
}

/**
 * 轨迹绘制函数
 * @param Array.<AMap.LngLat>||AMap.LngLat lngLats
 */
export function initTrack(tracks) {
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
      // 设置数据
      data: tracks
    })
    // 创建一个巡航器，关联（轨迹1）
    for (let i = 0; i < tracks.length; i++) {
      pathSimplifierIns.createPathNavigator(i, {
        loop: false, // 循环播放
        speed: 300 // 巡航速度，单位千米/小时
      }).start()
    }
    pathSimplifierIns.on('pathClick pointClick', () => {
      if (trackInfoNotification !== null) {
        trackInfoNotification.close()
        trackInfoNotification = null
      }
      trackInfo()
    })
  }
}

// 轨迹信息窗口
export function trackInfo() {
  const allSelctTime = selectEndTime.getTime() - selectStartTime.getTime() // 选择的总时间毫秒
  const runInfo = countRunTime(runPoints, allSelctTime)
  // 实例化轨迹弹出信息窗口
  const htmlMSG = '<p>运行次数：' + (runInfo.count + runInfo.halfCount) + '次</p><p>运行总时间：' + timestampsToTime(runInfo.runTime) + '</p><p>停止总时间：' + timestampsToTime(runInfo.stopTime) + '</p>'
  // if (runInfo.count !== 0) {
  //   if (runInfo.halfCount !== 0) {
  //     htmlMSG = '<p>运行趟数：' + runInfo.count + '个整趟,' + runInfo.halfCount + '个半趟</p><p>运行总时间：' + timestampsToTime(runInfo.runTime) + '</p><p>停止总时间：' + timestampsToTime(runInfo.stopTime) + '</p>'
  //   } else {
  //     htmlMSG = '<p>运行趟数：' + runInfo.count + '整趟</p><p>运行总时间：' + timestampsToTime(runInfo.runTime) + '</p><p>停止总时间：' + timestampsToTime(runInfo.stopTime) + '</p>'
  //   }
  // } else {
  //   htmlMSG = '<p>运行趟数：' + runInfo.halfCount + '个半趟</p><p>运行总时间：' + timestampsToTime(runInfo.runTime) + '</p><p>停止总时间：' + timestampsToTime(runInfo.stopTime) + '</p>'
  // }
  const title = '在' + timestampsToTime(allSelctTime) + '内的轨迹信息：'
  trackInfoNotification = Notification({
    title: title,
    dangerouslyUseHTMLString: true,
    message: htmlMSG,
    duration: 0,
    position: 'top-right',
    offset: 150
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
 */
function countRunNums(list, sd, ed) {
  if (sd === ed) {
    return
  }
  // console.log(3)
  let nsd = sd // 下一次查询的起始位置
  // 运行时间节点对象
  const runPoint = {
    flag: null, // 标志位表明是否运行完: 0:没有 1:完成
    startPoint: null, // 本次运行时间段的起始时间点
    endPoint: null,
    startID: null, // 本次运行时间段在总数据集合中的位置(索引)
    endID: null
  }
  // 起始点数据显示运行中
  if (list[sd].endRunTime === '0') {
    if (intToDate(list[sd].gpsTime).getTime - new Date(list[sd].startRunTime).getTime < 20000) {
      runPoint.startPoint = new Date(list[sd].startRunTime)
      runPoint.startID = sd
    } else {
      runPoint.startPoint = intToDate(list[sd].gpsTime) // 第1点就正在运行则用该条数据的gps时间代替;注意转换数据格式
      runPoint.startID = sd
      runPoint.flag = 0
    }
    // 寻找运行的结束时间点
    for (let i = sd - 1; i >= ed; i--) {
      if (list[i].endRunTime !== '0') { // endRunTime !== 0 表示运行停止
        runPoint.endPoint = new Date(list[i].endRunTime) // 获取运行的结束时间点
        runPoint.endID = i
        if (runPoint.flag !== 0) {
          runPoint.flag = 1
        }
        runPoints.push(runPoint) // 收录运行节点
        nsd = i - 1
        break
      }
      if (i === ed && list[ed].endRunTime === '0') { // 遍历完数据仍没有结束运行
        runPoint.endPoint = intToDate(list[ed].gpsTime) // 用该条数据的gps时间代替;注意转换数据格式
        runPoint.endID = i
        runPoint.flag = 0
        runPoints.push(runPoint) // 收录运行节点
        nsd = ed
      }
    }
    if (nsd > ed) { // 递归运行下一次查询
      countRunNums(list, nsd, ed)
    }
  } else { // 起始点数据未运行
    // 寻找第一次开始运行的点
    let tempsd = null
    for (let i = sd - 1; i >= ed; i--) {
      if (i === ed && list[ed].endRunTime !== '0') { // 遍历完数据仍没有开始运行 即该段数据全是未运行
        return
      }
      if (list[i].endRunTime === '0') {
        runPoint.startPoint = new Date(list[sd].startRunTime) // 获取运行的开始时间点
        runPoint.startID = i
        tempsd = i
        break
      }
    }
    if (tempsd <= ed) { // 最后一条数据为开始点则不收录不再寻找结束点
      nsd = ed
      return
    }
    // 寻找运行的结束时间点
    for (let i = tempsd - 1; i >= ed; i--) {
      if (list[i].endRunTime !== '0') { // endRunTime !== 0 表示运行停止
        runPoint.endPoint = new Date(list[i].endRunTime) // 获取运行的结束时间点
        runPoint.endID = i
        runPoint.flag = 1
        runPoints.push(runPoint) // 收录运行节点
        nsd = i - 1
        break
      }
      if (i === ed && list[ed].endRunTime === '0') { // 遍历完数据仍没有结束运行
        runPoint.flag = 0
        runPoint.endID = i
        runPoint.endPoint = intToDate(list[ed].gpsTime) // 用该条数据的gps时间代替;注意转换数据格式
        runPoints.push(runPoint) // 收录运行节点
        nsd = ed
      }
    }
    if (nsd > ed) {
      countRunNums(list, nsd, ed)
    }
  }
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
      var endT = runPoint.endPoint.getTime()
      var strT = runPoint.startPoint.getTime()
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
