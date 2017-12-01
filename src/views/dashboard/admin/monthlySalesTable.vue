<template>
  <el-card class="box-card monthlySalesTable">
    <div slot="header" class="clearfix">
      <span v-bind="date"> {{ date.year }}年销售统计 (RMB)</span>
      <!-- <el-button style="float: right; padding: 3px 0" type="text">Refresh</el-button> -->
    </div>
    <el-table
      v-loading="monthlySalesLoading"
      element-loading-text="Loading"
      :data="monthlySales"
      stripe style="width: 100%"
      show-summary
      sum-text="合计">
      <el-table-column
        prop="yearMonth"
        label="月份"
        align="center"
        fixed>
      </el-table-column>
      <el-table-column
        prop="order_counts"
        label="订单数"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="price"
        label="销售额"
        sortable
        align="right">
      </el-table-column>
      <el-table-column
        prop="cost"
        label="成本"
        align="right">
      </el-table-column>
      <el-table-column
        prop="shipping"
        label="运费"
        align="right">
      </el-table-column>
      <el-table-column
        prop="gross_profit"
        label="毛利"
        sortable
        align="right">
      </el-table-column>
      <el-table-column
        prop="gross_profit_rate"
        label="毛利率"
        align="center">
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { getMonthlySalesStats } from '@/api/stats'

export default {
  data() {
    return {
      monthlySales: null,
      monthlySalesLoading: true,
      date: {
        year: null,
        month: null
      },
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.monthlySalesLoading = true
      getMonthlySalesStats().then(response => {
        var stats = response.data
        this.monthlySales = stats.map(v => {
          this.date.year = v.year
          this.date.month = v.month
          v.yearMonth = v.month + '月'
          v.gross_profit_rate = (v.gross_profit_rate * 100).toFixed(2) + '%'
          return v
        })
      })
      this.monthlySalesLoading = false
    },
  }
}
</script>

<style>
.el-row {
  margin-bottom: 20px;
}
</style>