<template>
  <div>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入名">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-button type="primary" @click="addDialogVisible = true">添加请求头</el-button>
        </el-col>
      </el-row>
      <el-table border stripe max-height="450" :data="headers_list">
        <el-table-column label="ID" min-width="100" prop="id"></el-table-column>
        <el-table-column label="请求名" min-width="100" prop="headers_name"></el-table-column>
        <el-table-column label="请求体" min-width="650" prop="headers_body"></el-table-column>
        <el-table-column label="请求描述" min-width="200" prop="headers_content"></el-table-column>
        <el-table-column label="操作" fixed="right" width="150">
          <template>
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
        title="添加请求头"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDiaClose">
      <!--      内容主体区-->
      <el-form :model="addHeaders" :rules="addHeadersRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="请求名" prop="header_name">
          <el-input v-model="addHeaders.header_name"></el-input>
        </el-form-item>
        <el-form-item label="请求头信息" prop="header_data">
          <el-input type="textarea" v-model="addHeaders.header_data"></el-input>
        </el-form-item>
        <el-form-item label="请求描述" prop="header_content">
          <el-input type="textarea" v-model="addHeaders.header_content"></el-input>
        </el-form-item>
      </el-form>
      <!--      底部区-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addheader">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Message from 'element-ui'
export default {
  data() {
    return {
      addDialogVisible: false,
      addHeaders: {
        header_name: '',
        header_data: '',
        header_content: '',
      },
      addHeadersRules: {
        header_name: [
          {required: true, message: '请输入请求名', trigger: 'blur'},
          {min: 3, max: 30, message: '服务名的长度在3-30个字符之间', trigger: 'blur'}
        ],
        header_data: [
          {required: true, message: '请输入请求body', trigger: 'blur'},
        ]
      },
      headers_list: [],
      total: '',
    }
  },
  created() {
    this.getHeaders()
  },
  methods: {
    getHeaders() {
      this.$http.post('api/show-headers/')
          .then((res) => {
            console.log(res)
            this.headers_list = res.data['data']
            this.total = res.data['total']
          })
          .catch((res) => {
            console.log(res)
          })
    },
    addDiaClose() {
      this.$refs.addFormRef.resetFields()
    },
    addheader() {
      console.log(this.addHeaders)
      this.$http.post('api/add-headers/',
          this.addHeaders)
          .then((res) => {
            if (res.data['code'] === 0){
              Message.Message.success('添加成功')
              this.addDialogVisible = false
              this.getHeaders()
            }else{
              Message.Message.error(res.data['msg'])
            }
          })
          .catch((res) => {
            console.log(res)
            Message.Message.error('网络错误')
          })
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
  font-size: 12px;
  width: 100%;
}

.el-input {
  margin-bottom: 15px;
}
</style>