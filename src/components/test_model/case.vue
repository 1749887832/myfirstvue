<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="40">
        <el-col :span="8">
          <el-input placeholder="请输入名">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="chose_user" clearable placeholder="请选择">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
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
              value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addCaseDilog=true">创建用例</el-button>
        </el-col>
      </el-row>
      <el-table :data="gloaballist" border stripe max-height="450">
        <el-table-column label="ID" prop="id" width="100"></el-table-column>
        <el-table-column label="变量名" prop="globals_name" width="150"></el-table-column>
        <el-table-column label="使用名" prop="use_name" width="150"></el-table-column>
        <el-table-column label="类型" prop="globals_type" width="100"></el-table-column>
        <el-table-column label="状态" prop="use_type" width="100"></el-table-column>
        <el-table-column label="参数变量" prop="cite_arguments" width="150"></el-table-column>
        <el-table-column label="创建时间" prop="create_time" width="150"></el-table-column>
        <el-table-column label="描述" prop="content" width="200"></el-table-column>
        <el-table-column label="创建人" prop="create_user" width="100"></el-table-column>
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
        <el-form-item label="服务名" prop="casename">
          <el-input v-model="addCase.casename"></el-input>
        </el-form-item>
        <el-form-item label="所属模块" prop="casemodel">
          <el-cascader v-model="addCase.casemodel" :options="three_options" clearable @change="getThreeValue" size="200"></el-cascader>
        </el-form-item>
        <el-form-item label="服务描述">
          <el-input type="textarea" v-model="addCase.caseesc"></el-input>
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
export default {
  data() {
    return {
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
      addCaseDilog: false,
      total: 1,
      gloaballist: [],
      queryInfo: {
        globalname: '',
        // 选项
        chose_option: '',
        // 开始时间
        start_time: '',
        // 结束时间
        end_time: '',
        // 当前的页数
        page: 1,
        limit: 10
      },
      chose_user: '',
      chose_time: '',
      options: [{
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
  methods: {
    // 监听limit改变的事件
    handleSizeChange(newLimit) {
      this.queryInfo.limit = newLimit
      this.getGloballist()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage
      this.getGloballist()
    },
    addCaseDiaClose() {
    },
    getThreeValue(data) {
      console.log(data)
    },
    addCaseClose() {
      this.$refs.addCaseRef.resetFields()
    },
    addCaseFunc() {
      this.$refs.addCaseRef.validate(async res => {
        console.log(res)
        if (!res) return;
        this.$http.post('api/add-case/',
        this.addCase)
        .then((res)=>{
          console.log(res)
        })
        .catch((res)=>{
          console.log(res)
        })
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

.el-card {
  width: 100%;
  overflow: auto;
}

.el-cascader {
  width: 60%;
}
</style>