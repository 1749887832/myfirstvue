<template>
  <div>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入名" v-model="queryInfo.globalname">
            <el-button slot="append" icon="el-icon-search" @click="getGloballist"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="chose_user" clearable placeholder="请选择"
                     @clear="getGloballist"
                     @change="getChosedata">
            <el-option
                v-for="item in userlist"
                :key="item.id"
                :label="item.user_name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-date-picker
              v-model="chose_time"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
              @change="getChoseTime">
          </el-date-picker>
        </el-col>
      </el-row>
      <el-button type="primary" style="margin-top: 15px" @click="openglobalConfirm">添加变量</el-button>
      <el-table :data="gloaballist" border stripe max-height="430">
        <el-table-column label="ID" prop="id" width="100" min-width="100"></el-table-column>
        <el-table-column label="变量名" prop="globals_name" width="150" min-width="150"></el-table-column>
        <el-table-column label="使用名" prop="use_name" width="150" min-width="150"></el-table-column>
        <el-table-column label="状态" prop="globals_type" width="100" min-width="100"></el-table-column>
        <el-table-column label="类型" prop="use_type" width="100" min-width="100"></el-table-column>
        <el-table-column label="创建时间" prop="create_time" width="150" min-width="150"></el-table-column>
        <el-table-column label="描述" prop="content" width="200" min-width="200"></el-table-column>
        <el-table-column label="创建人" prop="create_user" width="100" min-width="100"></el-table-column>
        <el-table-column label="操作" fixed="right" width="150" min-width="150">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" @click="openGlobal(scope.row)"></el-button>
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
    <global_confirm :visible.sync="visible"
                    @showGlobal="getGloballist"
    ></global_confirm>
  </div>
</template>
<script>
import global_confirm from "@/components/server_model/global_model/global_confirm";
import Message from 'element-ui'

export default {
  components: {
    global_confirm
  },
  data() {
    return {
      visible: false,
      queryInfo: {
        globalname: '',
        // 选项
        chose_option: '',
        // 开始时间
        start_time: '',
        // 结束时间
        end_time: '',
        // 当前的页数
        page: 1,
        limit: 10
      },
      userlist:'',
      total: 0,
      activeName: 'first',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
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
      chose_user: '',
      chose_time: '',
      gloaballist: []
    }
  },
  methods: {
    // 获取全部的用户
    async getalluser(){
      const {data:res} = await this.$http.post('api/user/query/')
      this.userlist = res['data']
    },
    // 监听limit改变的事件
    handleSizeChange(newLimit) {
      this.queryInfo.limit = newLimit
      this.getGloballist()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage
      this.getGloballist()
    },
    async getGloballist() {
      const {data: res} = await this.$http.post('api/global/query/', this.queryInfo)
      this.gloaballist = res['data']
      this.total = res['total']
    },
    getChosedata(data) {
      console.log(typeof data)
      this.queryInfo.chose_option = data
      console.log(this.queryInfo)
      this.getGloballist()
      console.log(data)
    },
    getChoseTime(time) {
      if (time === null) {
        this.queryInfo.start_time = ''
        this.queryInfo.end_time = ''
      } else {
        this.queryInfo.start_time = time[0] + ' 00:00:00'
        this.queryInfo.end_time = time[1] + ' 23:59:59'
      }
      this.getGloballist()
    },
    openglobalConfirm() {
      this.visible = true
    },
    async delglobal(delglobalID) {
      const {data: res} =await this.$http.post('api/global/delete/', delglobalID)
      Message.Message.success(res['msg'])
      this.getGloballist()
    },
    openGlobal(delglobalID) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delglobal(delglobalID)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
  },

  created() {
    this.getGloballist()
    this.getalluser()
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
  font-size: 12px;
  width: 100%;
}
</style>