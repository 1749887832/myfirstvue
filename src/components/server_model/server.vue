<template>
  <div>
    <!--    面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片视图区-->
    <el-card class="box-card">
      <!--    页面导航-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入服务名" v-model="queryInfo.servername" clearable @clear="getServerList">
            <el-button slot="append" icon="el-icon-search" @click="getServerList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible=true">添加服务</el-button>
        </el-col>
        <el-col :span="6"></el-col>
        <el-col :span="6"></el-col>
      </el-row>
      <!--      列表区域-->
      <el-table :data="serverlist" border stripe max-height="450">
        <el-table-column label="ID" prop="id" width="100"></el-table-column>
        <el-table-column label="服务名" prop="name" width="150"></el-table-column>
        <el-table-column label="IP地址" prop="server_ip" width="250"></el-table-column>
        <el-table-column label="描述" prop="server_describe" width="250"></el-table-column>
        <el-table-column label="创建时间" prop="create_time" width="150"></el-table-column>
        <el-table-column label="创建人" prop="create_user" width="150"></el-table-column>
        <el-table-column label="状态">
          <!--          作用域插槽-->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.server_status" @change="serverChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150">
          <template slot-scope="scope">
            <!--            修改按钮-->
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" @click="serverEdit(scope.row)"></el-button>
            </el-tooltip>
            <!--            删除按钮-->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" @click="opendelete(scope.row)"></el-button>
            </el-tooltip>

          </template>
        </el-table-column>
      </el-table>
      <!--        分页控件-->
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
    <!--    这是添加用户的对话框-->
    <el-dialog
        title="添加服务"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDiaClose">
      <!--      内容主体区-->
      <el-form :model="addServer" :rules="addServerRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="服务名" prop="servername">
          <el-input v-model="addServer.servername"></el-input>
        </el-form-item>
        <el-form-item label="服务IP" prop="serverip">
          <el-input v-model="addServer.serverip"></el-input>
        </el-form-item>
        <el-form-item label="服务描述">
          <el-input type="textarea" prop="server_desc" v-model="addServer.server_desc"></el-input>
        </el-form-item>
      </el-form>
      <!--      底部区-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogServer">添 加</el-button>
      </span>
    </el-dialog>
    <!--    这是编辑框-->
    <el-dialog
        title="编辑服务"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDiaClose">
      <!--      内容主体区-->
      <el-form :model="editServer" :rules="addServerRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="服务名" prop="servername">
          <el-input v-model="editServer.servername"></el-input>
        </el-form-item>
        <el-form-item label="服务IP" prop="serverip">
          <el-input v-model="editServer.serverip"></el-input>
        </el-form-item>
        <el-form-item label="服务描述" prop="server_desc">
          <el-input type="textarea" v-model="editServer.server_desc"></el-input>
        </el-form-item>
      </el-form>
      <!--      底部区-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogServer">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Message from 'element-ui'

export default {
  data() {
    return {
      //获取用户列表的参数对象
      queryInfo: {
        servername: '',
        // 当前的页数
        page: 1,
        limit: 10
      },
      serverlist: [],
      total: 0,
      // 控制对话框的显示还是隐藏
      addDialogVisible: false,
      // 控制编辑弹窗
      editDialogVisible: false,
      // 这是服务的表单数据
      addServer: {
        servername: '',
        serverip: '',
        server_desc: '',
      },
      // 这是编辑的表单数据
      editServer: {
        server_id: '',
        servername: '',
        serverip: '',
        server_desc: '',
      },
      // 这是添加表单的验证规则对象
      addServerRules: {
        servername: [
          {required: true, message: '请输入服务名', trigger: 'blur'},
          {min: 3, max: 30, message: '服务名的长度在3-30个字符之间', trigger: 'blur'}
        ],
        serverip: [
          {required: true, message: '请输入服务IP', trigger: 'blur'},
        ],
        server_desc: []
      }
    }
  },
  created() {
    this.getServerList()
  },
  methods: {
    async getServerList() {
      const {data: res} = await this.$http.post('api/server/query/', this.queryInfo)
      this.serverlist = res['data']
      this.total = res['total']
    },
    // 监听limit改变的事件
    handleSizeChange(newLimit) {
      this.queryInfo.limit = newLimit
      this.getServerList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage
      this.getServerList()
    },
    // 监听状态改变
    async serverChange(serverinfo) {
      const {data: res} = await this.$http.post('api/server/update/', serverinfo)
      Message.Message.success(res['msg'])
    },
    // 调用添加的接口
    async addDialogServer() {
      this.$refs.addFormRef.validate(async res => {
        if (!res) return;
        const {data: content} = await this.$http.post('api/server/add/', this.addServer)
        this.addDialogVisible = false
        Message.Message.success(content['msg'])
        this.getServerList()
      })
    },
    //  监听添加对话框的关闭事件
    addDiaClose() {
      this.$refs.addFormRef.resetFields()
      this.addServer = {}
    },
    editDiaClose() {
      this.$refs.editFormRef.resetFields()
      this.editServer = {}
    },
    // 打开删除确认框
    opendelete(deleteservername) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.RemoveServer(deleteservername)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 调用删除接口
    RemoveServer(deleteservername) {
      this.$http.post('api/server/delete/',
          deleteservername)
          .then((res) => {
            if (res.data['code'] === 0) {
              Message.Message.success('删除成功')
              this.getServerList()
            } else {
              Message.Message.error(res.data['msg'])
            }
          })
          .catch(() => {
            Message.Message.error('网络错误')
          })
    },
    // 编辑弹窗
    serverEdit(editserver) {
      this.editDialogVisible = true
      this.editServer.server_id = editserver.id
      this.editServer.servername = editserver.name
      this.editServer.serverip = editserver.server_ip
      this.editServer.server_desc = editserver.server_describe
    },
    // 编辑请求接口
    editDialogServer() {
      this.$refs.editFormRef.validate(async res => {
        if (!res) return;
        this.$http.post('api/server/edit/',
            this.editServer)
            .then((res) => {
              if (res.data['code'] === 0) {
                Message.Message.success(res.data['msg'])
                this.editDialogVisible = false
                this.getServerList()
              } else {
                Message.Message.error(res.data['msg'])
                this.editDialogVisible = false
              }
            })
            .catch(() => {
              Message.Message.error('网络错误')
            })
      })
    }
  },
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
  font-size: 12px;
  width: 100%;
}

.el-pagination {
  margin-top: 10px;
}
</style>