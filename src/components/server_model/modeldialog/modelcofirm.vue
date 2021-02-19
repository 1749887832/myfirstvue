<template>
  <el-dialog title="添加系统模块"
             :visible="visible"
             width="1000px">
    <el-form ref="modelRef" label-width="100px" :model="addModelForm" :rules="addModelRules">
      <el-form-item label="所属模块" prop="belongModel">
        <el-cascader
            :options="options"
            :props="{ checkStrictly: true }"
            clearable
            style="width: 300px"
            v-model="addModelForm.belongModel"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="模块名称" prop="modelName">
        <el-input v-model="addModelForm.modelName"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="CloseModelDialog">取 消</el-button>
      <el-button type="primary" @click="CloseModelDialog">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {Message} from "element-ui";

export default {
  name: "modelConfirm",
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }]
        }]
      }],
      addModelForm: {
        belongModel: '',
        modelName: '',
      },
      addModelRules: {
        belongModel: [
          {required: true, message: '请选择所属模块', trigger: 'blur'}
        ],
        modelName: [
          {required: true, message: '请填写模块名', trigger: 'blur'}
        ],
      },
    }
  },
  methods: {
    CloseModelDialog() {
      this.$refs.modelRef.validate(async res => {
        if (!res) return;
        const {data: msg} = await this.$http.post('api/add/model/', this.addModelForm)
        if (msg['code'] === 0) {
          Message.success(msg['msg'])
          console.log(this.addModelForm)
          this.$emit('update:visible', false)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>