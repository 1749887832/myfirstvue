<template>
  <el-dialog
      title="添加全局变量"
      :visible="visible"
      width="1000px"
      @close="CloseGlobalConfirm">
    <el-form label-width="120px" :inline="true">
      <el-form-item label="使用名" style="width: 300px">
        <el-input style="width: 150px"></el-input>
      </el-form-item>
      <el-form-item label="变量类型" style="width: 300px">
        <el-select v-model="value" placeholder="请选择" @change="ChangeGlobal" style="width: 150px">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型" style="width: 300px">
        <el-select v-model="globalvalue" placeholder="请选择" style="width: 150px">
          <el-option
              v-for="item in globaltype"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <div v-show="fixation" style="width: 900px">
        <template>
          <el-form-item label="变量名">
            <el-input type="textarea" style="width: 770px" rows="5"></el-input>
          </el-form-item>
        </template>
      </div>
      <div v-show="actual">
        <el-form-item label="类型">
          <el-select v-model="actualvalue" placeholder="请选择" @change="ChangeActual">
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
            <el-form-item label="函数名">
              <el-input></el-input>
            </el-form-item>
          </template>
        </div>
        <div v-show="actualcon">
          <template>
            <el-form>
              <el-form-item label="接口地址">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="请求方式">
                <el-select v-model="actualvalue" placeholder="请选择" @change="ChangeActual">
                  <el-option
                      v-for="item in actualglobal"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="请求body">
                <el-input type="textarea"></el-input>
              </el-form-item>
              <el-form-item label="参数">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="参数">
                <el-input></el-input>
              </el-form-item>
            </el-form>
            <json-viewer :data="jsonData" :expand-depth=1 :value="jsonData"></json-viewer>
          </template>
        </div>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="CloseGlobalConfirm">取 消</el-button>
    <el-button type="primary" @click="CloseGlobalConfirm">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
import {globaltype} from './typedata'
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
      globalvalue:'int',
      actualglobal: [{
        value: 0,
        label: '函数'
      }, {
        value: 1,
        label: '接口'
      }],
      actualvalue: 0,
      value: 0,
      serverList: [],
      headersList: [],
    };
  },
  created() {
    // 获取请求服务
    this.getServerAndHeader()
  },
  methods: {
    async getServerAndHeader(){
      const {data: server} = await this.$http.post('api/all-server/')
      this.serverList = server['data']
      const {data: header} = await this.$http.post('api/show-headers/')
      this.headersList = header['data']
    },
    CloseGlobalConfirm() {
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
    }
  }
}
</script>

<style lang="less" scoped>

</style>