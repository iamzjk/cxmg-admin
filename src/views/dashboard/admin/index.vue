<template>
	<div class="dashboard-editor-container">
		<!-- <github></github> -->
		<!-- <el-row class="btn-group">
			<el-col :span="4" class='text-center'>
				<router-link class="pan-btn blue-btn" to="/components/index">Components</router-link>
			</el-col>
			<el-col :span="4" class='text-center'>
				<router-link class="pan-btn light-blue-btn" to="/charts/index">Charts</router-link>
			</el-col>
			<el-col :span="4" class='text-center'>
				<router-link class="pan-btn pink-btn" to="/excel/download">Excel</router-link>
			</el-col>
			<el-col :span="4" class='text-center'>
				<router-link class="pan-btn green-btn" to="/example/table/table">Table</router-link>
			</el-col>
			<el-col :span="4" class='text-center'>
				<router-link class="pan-btn tiffany-btn" to="/example/form/edit">Form</router-link>
			</el-col>
			<el-col :span="4" class='text-center'>
				<router-link class="pan-btn yellow-btn" to="/theme/index">Theme</router-link>
			</el-col>
		</el-row> -->

		<el-row :gutter="20">
			<el-col :span="16">
				<el-row>
					<el-card class="box-card">
					  	<div slot="header" class="clearfix">
							<span>2017年销售统计 (RMB)</span>
							<!-- <el-button style="float: right; padding: 3px 0" type="text">Refresh</el-button> -->
						</div>
						<monthly-sales-table></monthly-sales-table>
					</el-card>
				</el-row>
				<el-row>
					<el-card class="box-card">
						<line-chart></line-chart>
					</el-card>
				</el-row>
			</el-col>
			<el-col :span="8">
				<el-row>
					<el-col>
						<el-card class="box-card">
							<!-- <div slot="header" class="box-card-header">
								<pan-thumb class="panThumb" :image="avatar"> 你的权限:
									<span class="pan-info-roles" :key='item' v-for="item in roles">{{item}}</span>
								</pan-thumb>
							</div>
							<span class="display_name">{{name}}</span> -->
							<div v-if="countReady" >本月统计</div>
							<div class="info-item">
								<count-to class="sales-count" :startVal='0' :endVal='statisticsData.sales' :duration='3400'></count-to>
								<br><span class="info-item-text">销售</span>
								<!-- <icon-svg icon-class="trendChart1" class="dashboard-editor-icon"></icon-svg> -->
							</div>
							<div class="info-item">
								<count-to class="profit-count" :startVal='0' :endVal='statisticsData.grossProfit' :duration='3600'></count-to>
								<br><span class="info-item-text">利润</span>
								<!-- <icon-svg icon-class="trendChart2" class="dashboard-editor-icon"></icon-svg> -->
							</div>
						</el-card>
					</el-col>
				</el-row>
				<el-row>
					<client-ranking-table></client-ranking-table>
				</el-row>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import countTo from "vue-count-to";
import panThumb from "@/components/PanThumb";
// import todoList from "@/components/TodoList";
// import Github from "@/components/Github";
// import pieChart from "./pieChart";
// import barChart from "./barChart";
import lineChart from "./lineChart";
import monthlySalesTable from "./monthlySalesTable";
import clientRankingTable from "./clientRankingTable";
import { getMonthlySalesCountTo } from "@/api/stats";

export default {
  name: "dashboard-admin",
  components: {
    countTo,
    panThumb,
    // todoList,
    // Github,
	// pieChart,
    // barChart,
    lineChart,
	monthlySalesTable,
	clientRankingTable,
  },
  data() {
    return {
      statisticsData: {
        sales: null,
        grossProfit: null
	  },
	  countReady: false
    };
  },
  created() {
    this.fetchCountToData()
  },
  methods: {
    fetchCountToData() {
	  getMonthlySalesCountTo().then(response => {
		this.statisticsData.sales = response.data.sales
		this.statisticsData.grossProfit = response.data.gross_profit
		this.countReady = true
	  })
	}
  },
  computed: {
    ...mapGetters(["name", "avatar", "roles"])
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  margin: 30px;
  .btn-group {
    margin-bottom: 60px;
  }
  .box-card-header {
    position: relative;
    height: 160px;
  }
  .panThumb {
    z-index: 100;
    height: 150px;
    width: 150px;
    position: absolute;
    left: 0px;
    right: 0px;
    margin: auto;
  }
  .display_name {
    font-size: 30px;
    display: block;
  }
  .info-item {
    display: inline-block;
    margin-top: 10px;
    font-size: 14px;
    &:last-of-type {
      margin-left: 15px;
    }
  }
}
.info-item {
	.sales-count {
		font-size: 40px;
		line-height: 57px;
		font-weight: 600;
		color: #1ABB9C;
		font-family: "Helvetica Neue",Roboto,Arial,"Droid Sans",sans-serif;
	}
	.profit-count {
		font-size: 40px;
		line-height: 57px;
		font-weight: 600;
		color: #54aff9;
		font-family: "Helvetica Neue",Roboto,Arial,"Droid Sans",sans-serif;
	}
}
.info-item .info-item-text {
  color: dimgrey;
}
</style>
