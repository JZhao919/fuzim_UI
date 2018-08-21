import AMap from 'AMap'
import AMapUI from 'AMapUI'
let trailmap // 全局地图

export function dateToStr(datetime) {
  datetime = new Date(datetime)
  var year = datetime.getFullYear()
  var month = datetime.getMonth() + 1 // js从0开始取
  var date = datetime.getDate()
  var hour = datetime.getHours()
  var minutes = datetime.getMinutes()
  var second = datetime.getSeconds()
  if (month < 10) {
    month = "0" + month
  }
  if (date < 10) {
    date = "0" + date
  }
  if (hour < 10) {
    hour = "0" + hour
  }
  if (minutes < 10) {
    minutes = "0" + minutes
  }
  if (second < 10) {
    second = "0" + second
  }
  var time = year + month + date + hour + minutes + second // 20090612171805
  return time
}
// 地图初始化函数
export function initMap() {
  trailmap = new AMap.Map('trailmap', {
    center: [118.789582, 32.019405],
    zoom: 19
  })
  trailmap.plugin(['AMap.ToolBar', 'AMap.Scale'], () => {
    trailmap.addControl(new AMap.ToolBar())
    trailmap.addControl(new AMap.Scale())
  })
}

// 轨迹绘制
export function trailMaker() {
  AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], (PathSimplifier, $) => {
    if (!PathSimplifier.supportCanvas) {
      alert('当前环境不支持 Canvas！')
      return
    }
    initPage(PathSimplifier)
  })
  function initPage(PathSimplifier) {
    // 创建组件实例
    var pathSimplifierIns = new PathSimplifier({
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
          // 鼠标悬停在某个轨迹节点上
          return pathData.name + '，点：' + pointIndex + '/' + pathData.path.length
        }
        // 鼠标悬停在节点之间的连线上
        return pathData.name + '，点数量' + pathData.path.length
      },
      renderOptions: { // 轨迹线的样式
        renderAllPointsIfNumberBelow: 100 // 绘制路线节点，如不需要可设置为-1
      }
    })
    // window.pathSimplifierIns = pathSimplifierIns;
    // 设置数据构建一条简单的轨迹，仅作示例
    pathSimplifierIns.setData([
      {
        name: '轨迹1',
        path: [
          [118.789357, 32.019246],
          [118.790065, 32.019737],
          [118.79073, 32.020192],
          [118.791583, 32.020706],
          [118.792297, 32.021197],
          [118.792832, 32.021536],
          [118.793314, 32.020962],
          [118.793529, 32.02018],
          [118.794119, 32.019744],
          [118.794623, 32.019616],
          [118.794988, 32.019316],
          [118.795063, 32.018807]
        ]
      }
    ])
    // 创建一个巡航器，关联第1条轨迹（轨迹1）
    var navg1 = pathSimplifierIns.createPathNavigator(0, {
      loop: true, // 循环播放
      speed: 200 // 巡航速度，单位千米/小时
    })
    navg1.start()
  }
}
