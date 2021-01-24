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
        @close="addStepClose">
      <el-form label-width="100px" :inline="true" ref="addStepRef" :rules="addStepRules" :model="stepFrom">
        <el-form-item label="url:" style="width: 500px" prop="step_name">
          <el-input clearable placeholder="请输入请求接口" v-model="stepFrom.step_url" style="width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="请求类型:" style="width: 400px" prop="step_type">
          <el-select v-model="stepFrom.step_type" placeholder="请求类型">
            <el-option label="POST" value="POST"></el-option>
            <el-option label="GET" value="GET"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="body" style="width: 900px">
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
          <el-input v-model="domain.value" style="width: 150px;margin-right:20px" placeholder="断言期望"></el-input>
          <template>
            <span v-if="assert_result[index].code === 0" style="color: #67C23A">
              {{assert_result[index].assert_result}}
            </span>
            <span v-else style="color: #f56c6c">
              {{assert_result[index].assert_result}}
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
          <el-form-item label="变量名">
            <el-input v-model="stepFrom.global_name" placeholder="请输入使用参数的变量名"></el-input>
          </el-form-item>
          <el-form-item label="参数名">
            <el-input v-model="stepFrom.argument" placeholder="参数名必须为后端返回"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="步骤描述" style="width: 900px">
          <el-input type="textarea" :rows="5" style="width: 800px" v-model="stepFrom.step_data"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="Debugstep">调试</el-button>
      <json-viewer :data="jsonData" :expand-depth=1 :value="jsonData"></json-viewer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addStep">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Message from 'element-ui'

export default {
  data() {
    return {
      // 调试的json
      jsonData: {},
      // 获取断言结果
      assert_result: [{
        'code':'',
        'assert_result':'',
      }],
      // 控制显示获取参数
      showglobals: false,
      // 表单数据
      stepFrom: {
        step_url: '',
        step_type: '',
        step_content: '',
        argument: '',
        global_name: '',
        assert_name: [{
          value: '',
          name: '',
          type: '',
        }],
        delivery: false,
        step_data: '',
      },
      // 接受后端的返回参数
      steplist: [],
      // 控制弹窗的显示还是不显示
      dialogVisible: false,
      // 下拉选择框
      chose_options: [{
        value: 'equal',
        label: '等于(==)'
      }, {
        value: 'not_equal',
        label: '不等于(!=)'
      }, {
        value: 'less',
        label: '小于(<)'
      }, {
        value: 'greater',
        label: '大于(>)'
      }, {
        value: 'less_equal',
        label: '小于等于(<=)'
      }, {
        value: 'greater_equal',
        label: '大于等于(>=)'
      }, {
        value: 'in_to',
        label: '包含(in)'
      }, {
        value: 'not_in',
        label: '不包含(not in)'
      }],
      addStepRules: {
        step_url: [
          {required: true, message: '请填写步骤名', trigger: 'blur'},
          {min: 3, max: 10, message: '名称在3-10个字符之间', trigger: 'blur'}
        ],
        step_type: [
          {required: true, message: '请选择请求类型', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    addDomain() {
      this.assert_result.push({
        'code':'',
        'assert_result':'',
      })
      this.stepFrom.assert_name.push({
        value: '',
        name: '',
        type: ''
      })
    },
    removeDomain(item) {
      let long = this.stepFrom.assert_name.length
      let index = this.stepFrom.assert_name.indexOf(item)
      if (long > 1) {
        this.stepFrom.assert_name.splice(index, 1)
        this.assert_result.splice(index,1)
      } else {
        Message.Message.info('至少要有一个断言参数')
      }
    },
    showGlobal(nowstatus) {
      this.showglobals = nowstatus === true;
      if (!this.delivery) {
        this.stepFrom.global_name = ''
        this.stepFrom.argument = ''
      }
    },
    addStep() {
      this.$refs.addStepRef.validate(async res => {
        console.log(res)
        console.log(this.stepFrom)
        if (!res) return;
        this.$http.post('api/add-step/',
            this.stepFrom)
            .then((res) => {
              console.log(res)
            })
            .catch((res) => {
              console.log(res)
            })
      })
    },
    Debugstep() {
      this.$refs.addStepRef.validate(async res => {
        console.log(res)
        console.log(this.stepFrom)
        if (!res) return;
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        this.$http.post('api/debug-step/',
            this.stepFrom)
            .then((res) => {
              if (res.data['code'] === 0) {
                this.jsonData = res.data['data'][0]
                this.assert_result = res.data['data'][1]
                console.log(this.assert_result)
              } else {
                Message.Message.error('网络错误')
              }
              console.log(res)
              loading.close()
            },)
            .catch((res) => {
              loading.close()
              Message.Message.error('网络错误')
              console.log(res)
            })
      })
    },
    addStepClose() {
      this.$refs.addStepRef.resetFields()
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