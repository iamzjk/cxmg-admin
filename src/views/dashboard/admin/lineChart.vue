<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts 主题
import { debounce, getDaysArray } from '@/utils'
import { getDailySalesSummary } from '@/api/stats'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chart: null,
      chartData: null,
    }
  },
  mounted() {
    getDailySalesSummary().then(response => {
      this.chartData = response.data
      this.initChart()
    })

    if (this.autoResize) {
      this.__resizeHanlder = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHanlder)
    }

    // 监听侧边栏的变化
    const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    sidebarElm.addEventListener('transitionend', this.__resizeHanlder)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHanlder)
    }

    const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    sidebarElm.removeEventListener('transitionend', this.__resizeHanlder)

    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      var days = getDaysArray(2017, 11)
      this.chart.setOption({
        title: {
          text: '本月每日销量走势图',
          textStyle: {
            fontSize: 16
          }
        },
        xAxis: {
          data: days,
          boundaryGap: false
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        yAxis: {},
        series: [{
          name: 'Sales',
          itemStyle: {
            normal: {
              areaStyle: {}
            }
          },
          smooth: true,
          type: 'line',
          data: this.chartData.sales,
          animationDuration: 2600,
          animationEasing: 'cubicInOut'
        },
        {
          name: 'Gross Profit',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: 'rgba(2, 197, 233, 0.2)',
              lineStyle: {
                color: 'rgba(2, 197, 233, 0.2)'
              },
              areaStyle: {
                color: 'rgba(99,194,255, 0.6)'
              }
            }
          },
          data: this.chartData.gross_profit,
          animationDuration: 2000,
          animationEasing: 'quadraticOut'
        }]
      })
    }
  }
}
</script>
