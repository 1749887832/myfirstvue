<template>
  <div>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入名">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-button type="primary">添加请求头</el-button>
        </el-col>
      </el-row>
      <el-table border stripe max-height="450">
        <el-table-column label="ID" width="100"></el-table-column>
        <el-table-column label="变量名" width="150"></el-table-column>
        <el-table-column label="使用名" width="150"></el-table-column>
        <el-table-column label="类型" width="100"></el-table-column>
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
    </el-card>
  </div>
</template>

<script>
export default {
name: "headers"
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
  font-size: 12px;
  width: 100%;
}
.el-input{
  margin-bottom: 15px;
}
</style>