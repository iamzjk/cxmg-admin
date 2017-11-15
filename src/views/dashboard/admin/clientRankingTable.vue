<template>
  <div class="clientRankingTable">
  <!-- <h4>英雄榜</h4> -->
  <!-- <p></p> -->
  <el-tabs type="border-card">
    <el-tab-pane label="本月">
      <el-table
        v-loading="loading"
        element-loading-text="Loading"
        :data="clientRanking.thisMonth"
        stripe
        style="width: 100%">
        <el-table-column
          prop="client"
          label="客户"
          align="center">
        </el-table-column>
        <el-table-column
          prop="sales"
          label="金额"
          align="center">
        </el-table-column>
        <el-table-column
          prop="order_counts"
          label="订单数"
          align="center">
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="今年">
      <el-table
        :data="clientRanking.thisYear"
        stripe style="width: 100%">
        <el-table-column
          prop="client"
          label="客户"
          align="center">
        </el-table-column>
        <el-table-column
          prop="sales"
          label="金额"
          align="center">
        </el-table-column>
        <el-table-column
          prop="order_counts"
          label="订单数"
          align="center">
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="去年">
      <el-table
        :data="clientRanking.lastYear"
        stripe style="width: 100%">
        <el-table-column
          prop="client"
          label="客户"
          align="center">
        </el-table-column>
        <el-table-column
          prop="sales"
          label="金额"
          align="center">
        </el-table-column>
        <el-table-column
          prop="order_counts"
          label="订单数"
          align="center">
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="历史">
      <el-table
        :data="clientRanking.alltime"
        stripe style="width: 100%">
        <el-table-column
          prop="client"
          label="客户"
          align="center">
        </el-table-column>
        <el-table-column
          prop="sales"
          label="金额"
          align="center">
        </el-table-column>
        <el-table-column
          prop="order_counts"
          label="订单数"
          align="center">
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import { getClientRankingStats } from '@/api/stats'

export default {
  data() {
    return {
      clientRanking: {
        'thisMonth': null,
        'thisYear': null,
        'lastYear': null,
        'alltime': null,
      },
      loading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      this.fetchClientRanking('thisMonth')
      this.fetchClientRanking('thisYear')
      this.fetchClientRanking('lastYear')
      this.fetchClientRanking('alltime')
      this.loading = false
    },
    fetchClientRanking(period) {
      getClientRankingStats(period).then(response => {
        this.clientRanking[period] = response.data
      })
    }
  }
}
</script>
