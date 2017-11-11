<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">

      <div class="filter-item">
        <el-input placeholder="搜索" style="width: 350px;" v-model="input5">
          <el-select v-model="select" slot="prepend" placeholder="选项">
            <el-option label="客户" value="1"></el-option>
            <el-option label="电话" value="2"></el-option>
            <el-option label="单号" value="3"></el-option>
            <el-option label="品名" value="3"></el-option>
          </el-select>
          <el-button slot="append" icon="search"></el-button>
        </el-input>
      </div>

      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="客户" v-model="listQuery.client">
      </el-input>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加订单</el-button>
    </div>

    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row>
      <el-table-column label="客户">
        <template scope="scope">
          <el-input v-show="scope.row.edit" size="small" v-model="scope.row.client"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.client }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" width="150" align="center">
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
      <el-table-column class-name="status-col" label="快递" width="110" align="center">
        <template scope="scope">
          <el-input v-show="scope.row.edit" size="small" v-model="scope.row.carrier"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.carrier }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.created_time}}</span>
        </template>
      </el-table-column>
      <el-table-column label="单号">
        <template scope="scope">
          <el-input v-show="scope.row.edit" size="small" v-model="scope.row.tracking"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.tracking }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180">
        <template scope="scope">
          <el-button :type="scope.row.edit?'success':'primary'" @click='editRow(scope.row)' size="small">{{scope.row.edit?'完成':'编辑'}}</el-button>
          <el-button size="small" type="danger" @click="deleteRow(scope.row.order_id, scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList, updateOrder, deleteOrder, createOrder } from '@/api/table'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        client: undefined,
        sort: '+id'
      },
      tempRow: {
        client: '',
        phone: '',
        product: '',
        price: 100,
        cost: 100,
        quantity: 1,
        tracking: '',
        carrier: '',
        edit: true,
      }
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
        this.list = orders.map(v => {
          this.$set(v, 'edit', false)
          return v
        })
        this.listLoading = false
      })
    },
    editRow(row) {
      if (row.edit) {
        const newRow = Object.assign({}, row)
        delete newRow.edit
        delete newRow.created_time
        if (row.order_id) {
          updateOrder(newRow)
        } else {
          createOrder(newRow)
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
    },
    handleFilter() {
      // this.listQuery.page = 1
      this.fetchData()
    },
    handleCreate() {
      // this.resetTemp()
      this.list.unshift(this.tempRow)
    },
  }
}
</script>

<style>
/* .el-table {
  font-size: 14px;
} */
.el-select .el-input {
  width: 90px;
}
</style>