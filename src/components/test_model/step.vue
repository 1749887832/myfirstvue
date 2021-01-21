<template>
  <div>
    <el-card>
      <el-row>
        <el-button type="primary" @click="dialogVisible=true">添加步骤</el-button>
        <el-button type="danger">删除步骤</el-button>
      </el-row>
      <!--列表区域-->
      <el-table :data="steplist" border stripe max-height="450">
        <el-table-column label="ID" width="100" type="selection"></el-table-column>
        <el-table-column label="操作" fixed="right" width="150">
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
    <el-dialog
        title="添加步骤"
        :visible.sync="dialogVisible"
        width="1000px"
      :inline="true">
      <el-form label-width="100px" :inline="true">
        <el-form-item label="url:" style="width: 500px">
          <el-input clearable placeholder="请输入请求接口" v-model="stepFrom.step_name" style="width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="请求类型:" style="width: 400px">
          <el-select v-model="stepFrom.step_type" placeholder="请求类型">
            <el-option label="POST" value="POST"></el-option>
            <el-option label="GET" value="GET"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="body" style="width: 900px">
          <el-input type="textarea" :rows="20" autosize style="width: 800px"></el-input>
        </el-form-item>
        <el-form-item
            style="padding-left: 20px"
            v-for="(domain, index) in dynamicValidateForm.domains"
            :label="'断言' + index"
            :key="domain.key"
            :prop="'domains.' + index + '.value'"
        >
          <el-input placeholder="断言参数" style="width: 150px"></el-input>
          <el-select v-model="domain.value" placeholder="类型">
            <el-option
                style="width: 150px"
                v-for="item in chose_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
          </el-select>
          <el-input v-model="domain.value" style="width: 150px"></el-input>
          <el-button @click.prevent="removeDomain(domain)">删除</el-button>
        </el-form-item>
        <el-button @click="addDomain">新增断言</el-button>
        <el-form-item label="即时配送" prop="delivery">
          <el-switch v-model="dynamicValidateForm.delivery"></el-switch>
        </el-form-item>
        <el-form-item label="审批人">
          <el-input v-model="formInline.user" placeholder="审批人"></el-input>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select v-model="formInline.region" placeholder="活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="步骤描述">
          <el-input type="textarea" :rows="5" autosize></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stepFrom:{
        step_name:'',
        step_type:'',
      },
      chose_options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      formInline: {
        user: '',
        region: ''
      },
      steplist: [],
      dialogVisible: false,
      dynamicValidateForm: {
        domains: [{
          value: ''
        }],
        email: '',
        delivery:false,
      },
    }
  },
  methods:{
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: '',
        key: Date.now()
      })
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
      }
    },
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