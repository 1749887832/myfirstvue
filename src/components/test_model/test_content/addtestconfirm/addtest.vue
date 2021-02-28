<template>
  <el-dialog
      title="创建测试单"
      :visible="visible"
      @close="CloseAddTest"
      width="1000px">
    <el-form :model="form" label-width="80px" ref="AddTestData" :rules="AddTestRules">
      <el-form-item label="所属项目" prop="belongProject">
        <el-input v-model="form.belongProject" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="负责人" prop="person">
        <el-select v-model="form.person" placeholder="请选择负责人">
          <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.user_name"
              :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称" prop="testName">
        <el-input v-model="form.testName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="时间周期" prop="time">
        <div class="block">
          <el-date-picker
              v-model="form.time"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="描述" prop="content">
        <el-input type="textarea"
                  v-model="form.content"
                  autocomplete="off"
                  :rows="4"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="CloseAddTest">取 消</el-button>
      <el-button type="primary" @click="AddTest">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {Message} from "element-ui";

export default {
  name: "addtest",
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      value: '',
      dialogFormVisible: false,
      userList: '',
      form: {
        belongProject: '',
        person: '',
        testName: '',
        time: '',
        content: '',
      },
      AddTestRules: {
        belongProject: [
          {required: true, message: '所属项目为必填项', trigger: 'blur'}
        ],
        person: [
          {required: true, message: '负责人为必填项', trigger: 'change'}
        ],
        testName: [
          {required: true, message: '名称必填项', trigger: 'blur'}
        ],
        time: [
          {required: true, message: '时间周期为必填项', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '描述信息为必填项', trigger: 'blur'}
        ],
      }
    };
  },
  created() {
    this.GetAllUser()
  },
  methods: {
    async GetAllUser() {
      const {data: user} = await this.$http.post('api/show/user/')
      this.userList = user['data']
    },
    CloseAddTest() {
      this.$emit('update:visible', false)
    },
    AddTest() {
      this.$refs.AddTestData.validate(async res => {
        if (!res) return;
        console.log(this.form)
        const {data: msg} = await this.$http.post('api/add/test/cell/', this.form)
        if (msg['code'] === 0) {
          Message.success(msg['msg'])
          this.CloseAddTest()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>