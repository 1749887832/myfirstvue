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
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="请求body：">
              <span>{{ props.row.requestBody }}</span>
            </el-form-item>
            <el-form-item label="响应信息：">
              <json-viewer :data="props.row.responseData" :expand-depth=1 :value="props.row.responseData"></json-viewer>
            </el-form-item>
            <el-form-item label="断言信息：">
              <p v-for="assert in props.row.assertData" :key="assert.id">
                <span>断言参数：{{ assert.argument }}</span>
                <span>断言类型：{{ assert.type }}</span>
                <span>断言期望：{{ assert.expect }}</span>
                <el-tooltip class="item" effect="dark" :content="''+assert.result" placement="top-start">
                  <span>实际结果：{{ assert.result }}</span>
                </el-tooltip>
                <span>断言结果：{{ assert.assert_result }}</span>
              </p>
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
        testList: [],
        serverId: '',
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
      this.testList.forEach((item) => {
        this.queryInfo.testList.push(item.id)
      })
      if (this.queryInfo.serverId === '') {
        Message.error('请选择服务地址')
      } else {
        const loading = this.$loading({
          lock: true,
          text: '调试中..',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        const {data: res} = await this.$http.post('api/debugTest/', this.queryInfo)
        for (var i = 0; i < this.testList.length; i++) {
          this.testList[i]['assertData'] = res['data'][i]['assertData']
          this.testList[i]['requestBody'] = res['data'][i]['requestBody']
          this.testList[i]['responseData'] = res['data'][i]['responseData']
        }
        loading.close()
      }
      this.queryInfo.testList = []
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

.demo-table-expand {
  .el-form-item {
    width: 100%;

    p span {
      float: left;
      width: 20%;
      height: 30px;
      overflow: hidden;
    }

    /deep/ .el-form-item__label {
      float: none;
      color: #55e535;
    }

    /deep/ .el-form-item__content {
      font-size: 12px;
    }
  }

}

</style>