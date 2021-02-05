<template>
  <el-dialog
      title="添加全局变量"
      :visible="visible"
      width="1000px"
      @close="CloseGlobalConfirm">
    <el-form label-width="80" :inline="true" ref="AddGloable" :model="AddglobalValue" :rules="Addglobalrules">
      <el-form-item label="变量名" prop="statename">
        <el-input style="width: 750px" v-model="AddglobalValue.statename"></el-input>
      </el-form-item>
      <el-form-item label="使用名" style="width: 300px" prop="globalname">
        <el-input style="width: 150px" v-model="AddglobalValue.globalname"></el-input>
      </el-form-item>
      <el-form-item label="变量类型" style="width: 300px">
        <el-select placeholder="请选择" @change="ChangeGlobal" style="width: 150px" v-model="AddglobalValue.globaltype">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型" style="width: 300px">
        <el-select placeholder="请选择" style="width: 150px" v-model="AddglobalValue.globalstyle">
          <el-option
              v-for="item in globaltype"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" label-width="64.38px">
        <el-input type="textarea" style="width: 770px" rows="2" v-model="AddglobalValue.content"></el-input>
      </el-form-item>
      <div v-show="fixation" style="width: 900px">
        <template>
          <el-form-item label="变量名" label-width="64.38px">
            <el-input type="textarea" style="width: 770px" rows="3" v-model="AddglobalValue.globalagrument"></el-input>
          </el-form-item>
        </template>
      </div>
      <div v-show="actual">
        <el-form-item label="类型" style="width: 400px" label-width="64.38px">
          <el-select v-model="AddglobalValue.realtype" placeholder="请选择" @change="ChangeActual" style="width: 150px">
            <el-option
                v-for="item in actualglobal"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <div v-show="actualfun">
          <template>
            <el-form-item label="函数名" label-width="64.38px">
              <el-input v-model="AddglobalValue.funname"></el-input>
            </el-form-item>
          </template>
        </div>
        <div v-show="actualcon">
          <template>
            <el-form label-width="80" :inline="true">
              <el-form-item label="地址" style="width: 520px" label-width="64.38px">
                <el-input style="width: 400px" v-model="AddglobalValue.urlname"></el-input>
              </el-form-item>
              <el-form-item label="请求方式">
                <el-select v-model="AddglobalValue.urltype" placeholder="请选择">
                  <el-option
                      v-for="item in requesttype"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="body" label-width="64.38px">
                <el-input type="textarea" style="width: 762px" rows="5" v-model="AddglobalValue.urlbody"></el-input>
              </el-form-item>
              <el-form-item label="参数" label-width="64.38px">
                <el-input v-model="AddglobalValue.getvalue[0].urlarument"></el-input>
              </el-form-item>
              <el-form-item label="下标">
                <el-input v-model="AddglobalValue.getvalue[0].urlindex"></el-input>
              </el-form-item>
              <template>
                <span style="color:#67C23A;max-width: 200px;line-height: 3">{{ returnvaue }}</span>
              </template>
            </el-form>
            <template>
              <el-select v-model="AddglobalValue.server" placeholder="请选择"
                         style="width: 200px;margin-right: 20px;margin-left: 64px">
                <el-option
                    v-for="item in serverList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
              <el-select v-model="AddglobalValue.headers" clearable placeholder="请选择请求头"
                         style="width: 200px;margin-right: 20px">
                <el-option
                    v-for="item in headersList"
                    :key="item.id"
                    :label="item.headers_name"
                    :value="item.id">
                </el-option>
              </el-select>
            </template>
            <el-button type="primary" @click="debugapi">调试</el-button>
            <json-viewer :data="jsonData" :expand-depth=1 :value="jsonData"></json-viewer>
          </template>
        </div>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="CloseGlobalConfirm">取 消</el-button>
    <el-button type="primary" @click="AddGloabalFun">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
import {globaltype} from './typedata'
import {Message} from "element-ui";

export default {
  name: "global_confirm",
  props: {
    visible: {
      type: Boolean,
      default: false
    }

  },
  data() {
    return {
      // 提交表单数据
      AddglobalValue: {
        statename: '',
        globalname: '',
        globaltype: 0,
        globalstyle: 'int',
        globalagrument: '',
        realtype: 0,
        funname: '',
        urlname: '',
        urltype: 'POST',
        urlbody: '',
        getvalue: [{
          urlarument: '',
          urlindex: '',
        }],
        headers: '',
        server: '',
        content:'',
      },
      jsonData: {},
      // 控制实时div显示
      actual: false,
      // 控制固定div显示
      fixation: true,
      // 控制实时的函数div显示
      actualfun: true,
      // 控制实时的接口div显示
      actualcon: false,
      options: [{
        value: 0,
        label: '固定'
      }, {
        value: 1,
        label: '实时'
      }],
      globaltype,
      actualglobal: [{
        value: 0,
        label: '函数'
      }, {
        value: 1,
        label: '接口'
      }],
      requesttype: [
        {
          value: 'POST',
          label: 'POST'
        }, {
          value: 'GET',
          label: 'GET'
        }
      ],
      serverList: [],
      headersList: [],
      // 调试返回
      returnvaue: '',
      Addglobalrules: {
        statename: [
          {required: true, message: '使用名为必填项', trigger: 'blur'}
        ],
        globalname: [
          {required: true, message: '使用名为必填项', trigger: 'blur'}
        ],
        globalagrument: [
          {required: true, message: '变量名为必填项', trigger: 'blur'}
        ]
      }
    };
  },
  created() {
    // 获取请求服务
    this.getServerAndHeader()
  },
  methods: {
    async getServerAndHeader() {
      const {data: server} = await this.$http.post('api/all-server/')
      this.serverList = server['data']
      const {data: header} = await this.$http.post('api/show-headers/')
      this.headersList = header['data']
    },
    CloseGlobalConfirm() {
      this.$refs.AddGloable.resetFields()
      this.AddglobalValue = {}
      this.$emit('update:visible', false)
    },
    // 监听下拉框的值，显示相应的变量
    ChangeGlobal(Checked) {
      if (Checked === 1) {
        this.actual = !this.actual
        this.fixation = !this.fixation
      } else {
        this.actual = !this.actual
        this.fixation = !this.fixation
      }
    },
    ChangeActual(chekced) {
      if (chekced === 1) {
        this.actualcon = !this.actualcon
        this.actualfun = !this.actualfun
      } else {
        this.actualcon = !this.actualcon
        this.actualfun = !this.actualfun
      }
    },
    // 添加变量
    AddGloabalFun() {
      this.$refs.AddGloable.validate(async res => {
        if (!res) return;
        const {data: msg} = await this.$http.post('api/add_global/', this.AddglobalValue)
        Message.success(msg['msg'])
        console.log(this.AddglobalValue)
      })
    },
    async debugapi() {
      this.$refs.AddGloable.validate(async res => {
        if (!res) return;
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        const {data: returnmsg} = await this.$http.post('api/debug-api/', this.AddglobalValue)
        this.jsonData = returnmsg['data']['list']
        if (returnmsg['data']['extend'].length !== 0) {
          this.returnvaue = returnmsg['data']['extend'][0]['msg']
        }
        loading.close()
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>