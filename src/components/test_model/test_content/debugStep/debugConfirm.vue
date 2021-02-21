<template>
  <el-dialog title="调试测试用例"
             :visible="visible"
             width="1000px"
             @close="closeDebugDialog">
    <el-select v-model="queryInfo.serverId" placeholder="请选择" style="width: 200px;margin-right: 20px">
      <el-option
          v-for="item in serverList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
      </el-option>
    </el-select>
    <el-button type="primary" @click="debugTest">调试</el-button>
    <el-table
        :data="testList"
        style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品名称">
              <span>{{ props.row.url }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
          label="ID"
          prop="id"
          width="100"
          min-width="100">
      </el-table-column>
      <el-table-column
          label="顺序"
          prop="order"
          width="60"
          min-width="60">
      </el-table-column>
      <el-table-column
          label="接口"
          :show-overflow-tooltip="true"
          prop="url"
          min-width="120">
      </el-table-column>
      <el-table-column
          label="请求方式"
          prop="type"
          width="100"
          min-width="100">
      </el-table-column>
      <el-table-column
          label="描述"
          :show-overflow-tooltip="true"
          prop="content">
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDebugDialog">取 消</el-button>
      <el-button type="primary" @click="closeDebugDialog">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {Message} from "element-ui";

export default {
  name: "debugConfirm",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    testList: {
      default: []
    },
    serverList: {
      default: []
    }
  },
  data() {
    return {
      queryInfo: {
          testList:[],
          serverId:'',
        }
    }
  },
  methods: {
    closeDebugDialog() {
      console.log(this.testList)
      console.log(this.visible)
      this.$emit('update:visible', false)
    },
    async debugTest() {
      this.testList.forEach((item)=>{
        this.queryInfo.testList.push(item.id)
      })
      if (this.queryInfo.serverId===''){
        Message.error('请选择服务地址')
      }else{
        const {data: res} = await this.$http.post('api/debugTest/', this.queryInfo)
        this.queryInfo.testList = []
        console.log(res)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>