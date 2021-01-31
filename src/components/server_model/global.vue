<template>
  <div>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入名" v-model="queryInfo.globalname">
            <el-button slot="append" icon="el-icon-search" @click="getGloballist"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="chose_user" clearable placeholder="请选择"
                     @clear="getGloballist"
                     @change="getChosedata">
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
              value-format="yyyy-MM-dd"
              @change="getChoseTime">
          </el-date-picker>
        </el-col>
      </el-row>
      <el-button type="primary" style="margin-top: 15px">添加变量</el-button>
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
  </div>
</template>
<script>
export default {
  data() {
    return {
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
      total: 0,
      activeName: 'first',
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
      chose_user: '',
      chose_time: '',
      gloaballist: []
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
    getGloballist() {
      this.$http.post('api/show-global/'
          , this.queryInfo)
          .then((res) => {
            console.log(res)
            this.gloaballist = res.data['data']
            this.total = res.data['total']
          })
          .catch((res) => {
            console.log(res)
          })
    },
    getChosedata(data) {
      console.log(typeof data)
      this.queryInfo.chose_option = data
      console.log(this.queryInfo)
      this.getGloballist()
      console.log(data)
    },
    getChoseTime(time){
      console.log(time[0])
      this.queryInfo.start_time=time[0]
      this.queryInfo.end_time=time[1]
      this.getGloballist()
    }
  },

  created() {
    this.getGloballist()
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
  font-size: 12px;
  width: 100%;
}
</style>