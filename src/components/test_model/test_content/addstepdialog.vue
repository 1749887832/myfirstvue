<template>
  <el-dialog
      title="添加步骤"
      :visible="visible"
      width="1000px"
      @close="addStepClose">
    <el-form label-width="100px" :inline="true" ref="addStepRef" :rules="addStepRules" :model="stepFrom">
      <el-form-item label="url" style="width: 500px" prop="step_url">
        <el-input clearable placeholder="请输入请求接口" v-model="stepFrom.step_url" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="请求类型" style="width: 400px" prop="step_type">
        <el-select v-model="stepFrom.step_type" placeholder="请求类型">
          <el-option label="POST" value="POST"></el-option>
          <el-option label="GET" value="GET"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请求参数" style="width: 900px">
        <el-input type="textarea" :rows="5" style="width: 800px" v-model="stepFrom.step_content"></el-input>
      </el-form-item>
      <el-form-item
          v-for="(domain, index) in stepFrom.assert_name"
          :label="'断言' + index"
          :key="domain.key"
          :prop="'assert_name.' + index + '.value'"
          :rules="{required: true, message: '断言不能为空', trigger: 'blur'}"
      >
        <el-input placeholder="断言参数" style="width: 150px;margin-right: 20px" v-model="domain.name"></el-input>
        <el-select v-model="domain.type" placeholder="类型" style="width: 150px;margin-right: 20px">
          <el-option
              v-for="item in chose_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
        </el-select>
        <el-select v-model="domain.argument_type" placeholder="传参类型" style="width: 120px;margin-right: 20px">
          <el-option
              v-for="argument in argument_type"
              :key="argument.value"
              :label="argument.label"
              :value="argument.value"></el-option>
        </el-select>
        <el-input v-model="domain.value" style="width: 120px;margin-right:20px" placeholder="断言期望"></el-input>
        <template>
            <span v-if="assert_result[index].code === 0" style="color: #67C23A">
              {{ assert_result[index].assert_result }}
            </span>
          <span v-else style="color: #f56c6c">
              {{ assert_result[index].assert_result }}
            </span>
        </template>
        <el-button icon="el-icon-minus" @click.prevent="removeDomain(domain)" type="danger"
                   :circle="true"></el-button>
      </el-form-item>
      <el-button icon="el-icon-plus" @click="addDomain" :circle="true" type="primary"></el-button>
      <el-form-item label="获取参数" style="width: 100%">
        <el-switch v-model="stepFrom.delivery" @change="showGlobal"></el-switch>
      </el-form-item>
      <div v-show="showglobals">
        <el-form-item v-for="(domain, index) in stepFrom.global_content"
                      :label="'变量' + index"
                      :key="domain.key"
                      :prop="'global_content.' + index + '.value'">
          <el-input v-model="domain.global_name" placeholder="参数的变量名"
                    style="width: 150px;margin-right: 20px"></el-input>
          <el-input v-model="domain.urlarument" placeholder="参数名" style="width: 150px;margin-right: 20px"></el-input>
          <el-input v-model="domain.urlindex" placeholder="下标" style="width: 150px;margin-right: 20px"></el-input>
          <template>
            <span style="color: #67C23A">
                {{ global_result[index].msg }}
              </span>
          </template>
          <el-button icon="el-icon-minus" @click.prevent="removeGloabl(domain)" type="danger"
                     :circle="true"></el-button>
        </el-form-item>
        <el-button icon="el-icon-plus" @click="addGloabl" :circle="true" type="primary"></el-button>
      </div>
      <el-form-item label="步骤描述" style="width: 900px">
        <el-input type="textarea" :rows="5" style="width: 800px" v-model="stepFrom.step_data"></el-input>
      </el-form-item>
    </el-form>
    <template>
      <el-select v-model="stepFrom.server_value" placeholder="请选择" style="width: 200px;margin-right: 20px">
        <el-option
            v-for="item in server_list"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="stepFrom.header_value" placeholder="请选择请求头" style="width: 200px;margin-right: 20px">
        <el-option
            v-for="item in header_list"
            :key="item.id"
            :label="item.headers_name"
            :value="item.id">
        </el-option>
      </el-select>
    </template>
    <el-button type="primary" @click="Debugstep">调试</el-button>
    <json-viewer :data="jsonData" :expand-depth=1 :value="jsonData"></json-viewer>
    <span slot="footer" class="dialog-footer">
        <el-button @click="addStepClose">取 消</el-button>
        <el-button type="primary" @click="addStep">确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
import Message from 'element-ui'
import {argument_type, chose_options} from './data.js'

export default {
  name: "addstepdialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    case_id: {}
  },
  data() {
    return {
      header_list: [],
      server_list: [],
      // 调试的json
      jsonData: {},
      // 获取断言结果
      assert_result: [{
        code: '',
        assert_result: '',
      }],
      global_result: [{
        code: '',
        msg: ''
      }],
      // 控制显示获取参数
      showglobals: false,
      // 表单数据
      stepFrom: {
        case_id: this.case_id,
        header_value: '',
        server_value: '',
        step_url: '',
        step_type: '',
        step_content: '',
        global_content: [{
          urlarument: '',
          global_name: '',
          urlindex: '',
        }],
        assert_name: [{
          value: '0',
          name: '$.code',
          type: 'equal',
          argument_type: 'str',
        }],
        delivery: false,
        step_data: '',
      },
      // 断言类型下拉选择框
      chose_options,
      // 断言参数类型
      argument_type,

      addStepRules: {
        step_url: [
          {required: true, message: '请填写步骤名', trigger: 'blur'},
        ],
        step_type: [
          {required: true, message: '请选择请求类型', trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    this.getHeaderAndServer()
  },
  methods: {
    async getHeaderAndServer(){
      const {data:header} = await this.$http.post('api/show-headers/')
      const {data:server}  = await this.$http.post('api/all-server/')
      if (header['data'].length>0){
        this.stepFrom.header_value = header['data'][0].id
      }
      if(server['data'].length>0){
        this.stepFrom.server_value = server['data'][0].id
      }
      this.header_list = header['data']
      this.server_list = server['data']
    },
    addDomain() {
      this.assert_result.push({
        code: '',
        assert_result: '',
      })
      this.stepFrom.assert_name.push({
        value: '0',
        name: '$.code',
        type: 'equal',
        argument_type: 'str',
      })
    },
    addGloabl() {
      this.global_result.push({
        code: '',
        msg: '',
      })
      this.stepFrom.global_content.push({
        argument: '',
        global_name: '',
        index: '',
      })
    },
    removeDomain(item) {
      let long = this.stepFrom.assert_name.length
      let index = this.stepFrom.assert_name.indexOf(item)
      if (long > 1) {
        this.stepFrom.assert_name.splice(index, 1)
        this.assert_result.splice(index, 1)
      } else {
        Message.Message.info('至少要有一个断言参数')
      }
    },
    removeGloabl(item) {
      let long = this.stepFrom.global_content.length
      let index = this.stepFrom.global_content.indexOf(item)
      if (long > 1) {
        this.stepFrom.global_content.splice(index, 1)
        this.global_result.splice(index, 1)
      } else {
        Message.Message.info('至少要有一个变量')
      }
    },
    showGlobal(nowstatus) {
      this.showglobals = nowstatus === true;
      if (!this.stepFrom.delivery) {
        this.stepFrom.global_name = ''
        this.stepFrom.argument = ''
        this.global_result = [{
          'code': '',
          'msg': '',
        }]
      }
    },
    addStep() {
      this.$refs.addStepRef.validate(async res => {
        if (!res) return;
        this.$http.post('api/add/step/', this.stepFrom)
            .then((res) => {
              if (res.data['code'] === 0) {
                this.addStepClose()
                Message.Message.success('添加成功')
              } else {
                Message.Message.success(res.data['msg'])
              }
            })
            .catch(() => {
            })
      })
    },
    async Debugstep() {
      this.$refs.addStepRef.validate(async res => {
        if (!res) return;
        const loading = this.$loading({
          lock: true,
          text: '调试中..',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        const {data: returnmsg} = await this.$http.post('api/debug/step/', this.stepFrom)
        if (returnmsg['code'] === 0){
          if (this.stepFrom.delivery){
            this.global_result = returnmsg['data'][0]['list']['extend']
          }else{
            this.global_result =  [{
              code: '',
              msg: ''
            }]
          }
          this.jsonData = returnmsg['data'][0]['list']['list']
          this.assert_result = returnmsg['data'][0]['list']['assert_result']
        }else{
          this.jsonData = {}
          // this.assert_result =  [{
          //   code: '',
          //   assert_result: '',
          // }]
          // this.global_result =  [{
          //   code: '',
          //   msg: ''
          // }]
        }
        console.log(returnmsg)
        loading.close()
      })
    },
    addStepClose() {
      this.$refs.addStepRef.resetFields()
      this.$emit('update:visible', false)
      this.$emit('addStep')
    }
  }
}
</script>

<style scoped>

</style>