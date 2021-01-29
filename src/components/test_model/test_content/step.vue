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
        <el-table-column label="接口地址" prop="step_url" min-width="400"></el-table-column>
        <el-table-column label="请求方式" prop="request_type" min-width="100"></el-table-column>
        <el-table-column label="请求参数" prop="request_data" min-width="1000" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="创建时间" prop="create_time" min-width="150"></el-table-column>
        <el-table-column label="创建人" prop="create_user" min-width="150"></el-table-column>
        <el-table-column label="操作" fixed="right" min-width="150">
          <template>
            <!--            修改按钮-->
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit"></el-button>
            </el-tooltip>
            <!--            删除按钮-->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <addstepdialog :visible.sync="visible" :case_id="case_id" @addStep="GetStepList"></addstepdialog>
  </div>
</template>

<script>
import Message from 'element-ui'
import addstepdialog from "@/components/test_model/test_content/addstepdialog";

export default {
  components: {
    addstepdialog
  },
  data() {
    return {
      // 存储case_id
      case_id: '',
      // 是否打开增加弹窗
      visible: false,
      // 接受后端的返回参数
      step_list: [],
    }
  },
  created() {
    if (!this.$route.params.id) {
      this.$router.push({path: '/case'})
    } else {
      this.case_id = this.$route.params.id
      this.GetStepList()
    }
    console.log(this.$route.params.id)
  },
  methods: {
    openAddstep() {
      console.log(this.visible)
      this.visible = true
    },
    GetStepList(){
      this.$http.post('api/show-step/',
          {'id': this.$route.params.id})
          .then((res) => {
            if (res.data['code'] === 0) {
              this.step_list = res.data['data']
            } else {
              Message.Message.error(res.data['msg'])
            }
          })
          .catch((res) => {
            Message.Message.error('网络错误')
            console.log(res)
          })
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