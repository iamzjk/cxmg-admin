<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <div class="filter-item">
        <el-input placeholder="模糊查找" style="width: 350px;" v-model="listQuery.search.value" @keyup.enter.native="handleFilter">
          <el-select v-model="listQuery.search.key" slot="prepend" placeholder="请选择">
            <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-button slot="append" icon="search" @click="handleFilter"></el-button>
        </el-input>
      </div>
      <!-- date picker -->
      <div v-if="showDatePicker" class="filter-item">
        <el-date-picker
          v-model="listQuery.dateRange"
          type="daterange"
          align="right"
          placeholder="创建日期"
          format="yyyy-MM-dd"
          :picker-options="datePickerOptions">
        </el-date-picker>
      </div>
      <el-button class="filter-item" @click="handleRefresh">刷新</el-button>
      <el-checkbox class="filter-item" style="margin-left: 8px" @change="handleToggleTracking" v-model="listQuery.showNoTracking">只显示未发货</el-checkbox>
      <!-- <div class="filter-item" style="font-size: 14px; margin-left: 100px;"><span>找到 {{ total }} 个订单</span></div> -->
      <!-- new order button -->
      <el-button class="filter-item" style="margin-left: 10px; float: right" @click="handleCreate" icon="plus" type="primary">新建订单</el-button>
    </div>

    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row>
      <el-table-column label="客户" align="center">
        <template scope="scope">
          <el-input v-show="scope.row.edit" size="small" v-model="scope.row.client"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.client }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" width="130" align="center">
        <template scope="scope">
          <el-input v-show="scope.row.edit" size="small" v-model="scope.row.phone"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品名" width="200" align="center">
        <template scope="scope">
          <el-input v-show="scope.row.edit" size="small" v-model="scope.row.product"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.product }}</span>
        </template>
      </el-table-column>
      <el-table-column label="售价" align="center">
        <template scope="scope">
          <el-input v-show="scope.row.edit" size="small" v-model="scope.row.price"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成本" align="center">
        <template scope="scope">
          <el-input v-show="scope.row.edit" size="small" v-model="scope.row.cost"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.cost }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center">
        <template scope="scope">
          <el-input v-show="scope.row.edit" size="small" v-model="scope.row.quantity"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="快递" align="center">
        <template scope="scope">
          <el-input v-show="scope.row.edit" size="small" v-model="scope.row.carrier"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.carrier }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单号" align="center" width="130">
        <template scope="scope">
          <el-input v-show="scope.row.edit" size="small" v-model="scope.row.tracking"></el-input>
          <el-button style="user-select: text;" type="text" @click="showTrackingStatus(scope.row)" v-show="!scope.row.edit">{{ scope.row.tracking }}</el-button>
          <!-- tracking status dialog -->
          <el-dialog title="快递状态" :visible.sync="scope.row.trackingStatusVisible">
            <span slot="title">
              <div style="margin-left: 15px; float: left; font-weight: bold;">{{scope.row.client}} {{scope.row.tracking}}</div>
            </span>
            <el-table v-loading="trackingLoading" :data="trackingStatusTemp" element-loading-text="拼命查询中...">
              <el-table-column property="time" label="日期时间" width="180" align= "center"></el-table-column>
              <el-table-column property="status" label="状态" align= "center"></el-table-column>
            </el-table>
            <span slot="footer">
              <el-button type="default" size="medium" @click="showTrackingStatus(scope.row)">刷新</el-button>
            </span>
          </el-dialog>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单日期" width="130">
        <template scope="scope">
          <!-- <i class="el-icon-time"></i> -->
          <span>{{scope.row.created_time}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150">
        <template scope="scope">
          <el-button :type="scope.row.edit?'success':'default'" @click='editRow(scope.row)' size="small">{{scope.row.edit?'完成':'编辑'}}</el-button>
          <el-button size="small" type="danger" @click="deleteRow(scope.row.order_id, scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getList, updateOrder, deleteOrder, createOrder } from '@/api/order'
import { getTrackingStatus} from '@/api/tracking'
import moment from 'moment'

export default {
  data() {
    return {
      gridData: [{
        time: '2016-05-02',
        status: 'John Smith',
        address: 'No.1518,  Jinshajiang Road, Putuo District'
      }, {
        time: '2016-05-04',
        status: 'John Smith',
        address: 'No.1518,  Jinshajiang Road, Putuo District'
      }, {
        time: '2016-05-01',
        status: 'John Smith',
        address: 'No.1518,  Jinshajiang Road, Putuo District'
      }, {
        time: '2016-05-03',
        status: 'John Smith',
        address: 'No.1518,  Jinshajiang Road, Putuo District'
      }],
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        sort: '+id',
        search: {
          key: 'client',
          value: undefined,
        },
        dateRange: '',
        showNoTracking: false
      },
      tempRow: {
        client: '',
        phone: '',
        product: '',
        price: 0,
        cost: 0,
        quantity: '',
        tracking: '',
        carrier: '',
        edit: true,
      },
      searchOptions: [{
        value: 'client',
        label: '客户'
      }, {
        value: 'phone',
        label: '电话'
      }, {
        value: 'tracking',
        label: '单号'
      }, {
        value: 'product',
        label: '品名'
      }],
      // tracking status temp storage
      trackingStatusTemp: [],
      trackingLoading: true,
      // date picker
      showDatePicker: false,
      datePickerOptions: {
        shortcuts: [{
          text: '最近一星期',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        const orders = response.data.orders
        this.total = response.data.total
        this.list = orders.map(v => {
          this.$set(v, 'edit', false)
          this.$set(v, 'trackingStatusVisible', false)
          v.created_time = moment(v.created_time).format('YYYY-MM-DD')
          return v
        })
        this.listLoading = false
        this.$message({
          message: '找到' + this.total + '个订单',
          type: 'success'
        })
      })
    },
    editRow(row) {
      if (row.edit) {
        const newRow = Object.assign({}, row)
        delete newRow.edit
        delete newRow.created_time
        delete newRow.trackingStatusVisible
        if (row.order_id) {
          updateOrder(newRow)
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
        } else {
          createOrder(newRow)
          this.fetchData()
          this.$message({
            message: '新建成功',
            type: 'success'
          })
        }

      }
      row.edit = !row.edit
    },
    deleteRow(order_id, index) {
      if (order_id) {
        deleteOrder(order_id).then(response => {
          this.list.splice(index, 1)
        })
      } else {
        this.list.shift(index, 1)
      }
      this.$message({
        message: '删除成功',
        type: 'success'
      })
    },
    handleFilter() {
      // this.listQuery.page = 1
      this.fetchData()
    },
    handleRefresh() {
      this.listQuery = {
        page: 1,
        limit: 20,
        sort: '+id',
        search: {
          key: 'client',
          value: undefined,
        },
        dateRange: '',
        showNoTracking: false
      }
      this.handleFilter()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.fetchData()
    },
    resetTempRow() {
      this.tempRow = {
        client: '',
        phone: '',
        product: '',
        price: 0,
        cost: 0,
        quantity: '',
        tracking: '',
        carrier: '',
        edit: true,
      }
    },
    handleCreate() {
      this.resetTempRow()
      this.tempRow.created_time = moment().format('YYYY-MM-DD')
      this.list.unshift(this.tempRow)
    },
    handleToggleTracking() {
      // this.listQuery.showNoTracking = !this.listQuery.showNoTracking
      this.handleFilter()
    },
    showTrackingStatus(row) {
      this.trackingStatusTemp = []
      this.trackingLoading = true
      row.trackingStatusVisible = true
      getTrackingStatus(row.tracking, row.carrier).then(response => {
        this.trackingStatusTemp = response.data.statuses
        this.trackingLoading = false
      })
    },
    refreshTrackingStatus(row) {
      getTrackingStatus(row.tracking, row.carrier).then(response => {
        this.trackingStatusTemp = response.data.statuses
      })
    }
  }
}

</script>

<style>
/* .app-container {
  zoom: 95%;
} */
/* .el-table {
  zoom: 80%;
  font-size: 14px;
} */
.el-dialog {
  top: 10%;
}
.el-select .el-input {
  width: 90px;
}
</style>