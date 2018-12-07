import AMap from 'AMap'
import AMapUI from 'AMapUI'
import GPS from '@/utils/GPS'
import { getAllGPSByIdTime, getAllGPSByIdTimeBetween } from "@/api/GPSinfo"
let trailmap = null // 全局地图
let pathSimplifierIns = null // 全局简单轨迹线

// 地图初始化函数
export function initMap() {
  if (trailmap !== null) {
    trailmap = null
  }
  trailmap = new AMap.Map('trailmap', {
    mapStyle: 'amap://styles/12cb5f735c7e70f55c221548b0e11763', // 设置地图的显示样式
    center: [118.789582, 32.019405],
    zoom: 15
  })
  trailmap.plugin(['AMap.ToolBar', 'AMap.Scale'], () => {
    trailmap.addControl(new AMap.ToolBar())
    trailmap.addControl(new AMap.Scale())
  })
}

/**
 * 坐标获取与数量处理与坐标系转换
 * @param number shipId
 * @param number startTime
 * @return Promise Array.<AMap.LngLat> gps
 */
export function getlngLatsOne(shipId, startTime) {
  const gps = [] // 处理后的坐标组
  return new Promise((resolve, rejects) => {
    getAllGPSByIdTime(shipId, startTime).then(response => {
      const data = response.data // 返回的坐标数据
      const gpslength = data.length
      if (!data || data === null || gpslength <= 0) {
        resolve(gps) // 返回空数组
      } else {
        if (gpslength > 1000) {
          const jump = parseInt(gpslength / 1000)
          for (let i = 0; i < gpslength; i += jump) {
            if (data[i].longitude && data[i].longitude !== 0 && data[i].latitude && data[i].latitude !== 0) {
              gps.push(GPS.gcj_encrypt(data[i].longitude, data[i].latitude))
            }
          }
        } else {
          for (let i = 0; i < gpslength; i++) {
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

export function getlngLatsTwo(shipId, startTime, endTime) {
  const gps = [] // 处理后的坐标组
  return new Promise((resolve, rejects) => {
    getAllGPSByIdTimeBetween(shipId, startTime, endTime).then(response => {
      const data = response.data // 返回的坐标数据
      const gpslength = data.length
      if (!data || data === null || gpslength <= 0) {
        resolve(gps) // 返回空数组
      } else {
        if (gpslength > 1000) {
          const jump = parseInt(gpslength / 1000)
          for (let i = 0; i < gpslength; i += jump) {
            if (data[i].longitude && data[i].longitude !== 0 && data[i].latitude && data[i].latitude !== 0) {
              gps.push(GPS.gcj_encrypt(data[i].longitude, data[i].latitude))
            }
          }
        } else {
          for (let i = 0; i < gpslength; i++) {
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
  }
}

// 清楚轨迹
export function clearTrack() {
  if (pathSimplifierIns !== null) {
    pathSimplifierIns.clearPathNavigators()
    pathSimplifierIns.setData(null)
    pathSimplifierIns = null
  }
}
