<template>
  <div>
    <el-card>
      <el-row :gutter="40">
        <el-col :span="8">
          <el-input placeholder="请输入名">
            <el-button slot="append" icon="el-icon-search" @click="getCaseList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="chose_user"
                     @change="getChoseUser"
                     @click="getCaseList"
                     clearable placeholder="请选择">
            <el-option
                v-for="item in userList"
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
        <el-col :span="4">
          <el-button type="primary" @click="addCaseDilog=true">创建用例</el-button>
        </el-col>
      </el-row>
      <el-table :data="caseList" border stripe max-height="450">
        <el-table-column label="ID" prop="id" width="100" fixed="left"></el-table-column>
        <el-table-column label="用例标题" prop="test_name" min-width="250"></el-table-column>
        <el-table-column label="用例描述" prop="test_content" min-width="550" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="创建人" prop="create_user" width="150"></el-table-column>
        <el-table-column label="创建时间" prop="create_time" width="200"></el-table-column>
        <el-table-column label="操作" fixed="right" width="230" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="调试" placement="top" :enterable="false">
              <el-button type="success" icon="el-icon-notebook-1" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="添加" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-reading" size="mini" @click="to_step(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
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
    <el-dialog
        title="提示"
        :visible.sync="addCaseDilog"
        width="50%"
        @close="addCaseClose">
      <el-form :model="addCase" :rules="addCaseRules" ref="addCaseRef" label-width="100px">
        <el-form-item label="用例标题" prop="casename">
          <el-input v-model="addCase.casename"></el-input>
        </el-form-item>
        <el-form-item label="所属模块" prop="casemodel">
          <el-cascader v-model="addCase.casemodel" :options="three_options" clearable @change="getThreeValue"
                       size="200"></el-cascader>
        </el-form-item>
        <el-form-item label="用例描述">
          <el-input type="textarea" v-model="addCase.caseesc" :rows="5"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCaseDilog = false">取 消</el-button>
        <el-button type="primary" @click="addCaseFunc">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Message from 'element-ui'

export default {
  data() {
    return {
      // 接收创建用户
      userList: [],
      // 接收返回的表格数据
      caseList: [],
      // 这是添加用户的表单
      addCase: {
        casename: '',
        casemodel: '',
        caseesc: '',
      },
      three_options: [{
        value: '1',
        label: '极运营',
        children: [{
          value: '1',
          label: '学生报名',
          children: [{
            value: '1',
            label: '学生下单流程',
          }]
        }]
      }],
      // 控制添加窗口的显示与不显示
      addCaseDilog: false,
      total: 0,
      queryInfo: {
        casename: '',
        // 选项
        chose_option: '',
        // 开始时间
        start_time: '',
        // 结束时间
        end_time: '',
        // 当前的页数
        page: 1,
        limit: 10,
      },
      chose_user: '',
      chose_time: '',
      options: [],
      // 这是验证表单规则
      addCaseRules: {
        casename: [
          {required: true, message: '请填写用例标题', trigger: 'blur'},
          {min: 3, max: 10, message: '用例标题在3-10个字符直减', trigger: 'blur'}
        ],
        casemodel: [
          {required: true, message: '所属模块不能为空', trigger: 'blur'}
        ]
      },
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
    }
  },
  created() {
    this.getCaseList()
    this.showuser()
    console.log(this.caseList)
  },
  methods: {
    getChoseUser(data) {
      this.queryInfo.chose_option = data
      this.getCaseList()
    },
    getChoseTime(time) {
      if (time === null) {
        this.queryInfo.start_time = ''
        this.queryInfo.end_time = ''
      } else {
        this.queryInfo.start_time = time[0] + ' 00:00:00'
        this.queryInfo.end_time = time[1] + ' 23:59:59'
      }
      this.getCaseList()
    },
    async showuser() {
      const {data: res} = await this.$http.post('api/show-user/')
      this.userList = res['data']
    },
    // 跳转到用例的步骤页面
    to_step(case_id) {
      console.log(case_id)
      this.$router.push({
        name: 'step',
        params: {
          'id': case_id
        }
      })
    },
    // 监听limit改变的事件
    handleSizeChange(newLimit) {
      this.queryInfo.limit = newLimit
      this.getCaseList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage
      this.getCaseList()
    },
    getThreeValue(data) {
      console.log(data)
    },
    addCaseClose() {
      this.$refs.addCaseRef.resetFields()
    },
    async addCaseFunc() {
      this.$refs.addCaseRef.validate(async res => {
        console.log(res)
        if (!res) return;
        const {data:msg} = await this.$http.post('api/add/case/', this.addCase)
        this.addCaseDilog = false
        Message.Message.success(msg['msg'])
        this.getCaseList()
      })
    },
    async getCaseList() {
      const {data: res} = await this.$http.post('api/show/case/', this.queryInfo)
      this.caseList = res['data']
      this.total = res.total
    },
  }
}

</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
  font-size: 12px;
  width: 100%;
}

.el-card {
  width: 100%;
  overflow: auto;
}

.el-cascader {
  width: 60%;
}
</style>