<template>
  <div>
    <el-card>
      <el-row>
        <el-button type="primary" @click="openAddstep">添加步骤</el-button>
        <el-button type="danger">删除步骤</el-button>
      </el-row>
      <!--列表区域-->
      <el-table :data="step_list" border stripe max-height="450">
        <el-table-column type="selection" min-width="55"></el-table-column>
        <el-table-column label="ID" prop="id" min-width="100"></el-table-column>
        <el-table-column label="执行顺序" prop="order" min-width="100"></el-table-column>
        <el-table-column label="接口地址" prop="step_url" min-width="400"
                         :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="请求方式" prop="request_type" min-width="100"></el-table-column>
        <el-table-column label="请求参数" prop="request_data" min-width="500"
                         :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="变量名" prop="useGlobal" min-width="200"
                         :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="步骤描述" prop="step_content" min-width="200"
                         :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="创建时间" prop="create_time" min-width="150"></el-table-column>
        <el-table-column label="创建人" prop="create_user" min-width="150"></el-table-column>
        <el-table-column label="操作" fixed="right" min-width="150">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" @click="openStepDel(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.page"
          :page-sizes="[10, 20, 30, 40,50,60,70,80,90,100]"
          :page-size="queryInfo.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
    <addstepdialog :visible.sync="visible" :case_id="queryInfo.id" @addStep="GetStepList"></addstepdialog>
  </div>
</template>

<script>
import addstepdialog from "@/components/test_model/test_content/addstepdialog";
import {Message} from "element-ui";

export default {
  components: {
    addstepdialog
  },
  data() {
    return {
      // 是否打开增加弹窗
      visible: false,
      total: 0,
      // 接受后端的返回参数
      step_list: [],
      queryInfo: {
        id: '',
        page: 1,
        limit: 10
      },
    }
  },
  created() {
    if (!this.$route.params.id) {
      this.$router.push({path: '/case'})
    } else {
      this.queryInfo.id = this.$route.params.id
      this.GetStepList()
    }
    console.log(this.$route.params.id)
  },
  methods: {
    // 监听limit改变的事件
    handleSizeChange(newLimit) {
      this.queryInfo.limit = newLimit
      this.GetStepList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage
      this.GetStepList()
    },
    openAddstep() {
      console.log(this.visible)
      this.visible = true
    },
    async GetStepList() {
      const {data: res} = await this.$http.post('api/show/step/', this.queryInfo)
      this.total = res['total']
      this.step_list = res['data']
    },
    openStepDel(delsteplID) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.DelStep(delsteplID)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    async DelStep(delsteplID) {
      const {data: res} = await this.$http.post('api/del/step/', delsteplID)
      Message.success(res['msg'])
      this.GetStepList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 20px;
  font-size: 12px;
}

//.el-form-item__content{
//  flex-wrap: wrap;
//}
</style>