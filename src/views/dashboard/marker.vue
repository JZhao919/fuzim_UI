<template>
    
</template>
<script>
import AMapUI from 'AMapUI'
export default {
  name: 'marker',
  props: {
    map: '',
    data() {
      return {
        marker: null
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // 引入SimpleMarker，loadUI的路径参数为模块名中 'ui/' 之后的部分
      AMapUI.loadUI(['overlay/SimpleMarker'], function(SimpleMarker) {
        // 创建SimpleMarker实例
        if (this.marker !== null) {
          this.marker = null
        }
        this.marker = new SimpleMarker({
          // 前景文字
          iconLabel: 'A',
          // 图标主题
          iconTheme: 'default',
          // 背景图标样式
          iconStyle: 'red',
          // ...其他Marker选项...，不包括content
          map: this.map,
          position: [116.405285, 39.904989]
        })
      })
    }
  }
}
</script>


