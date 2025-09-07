<template>
  <div class="class-page">
    <el-table
      :data="classTableList"
      row-key="classId"
      stripe
      style="width: 100%"
    >
      <el-table-column
        prop="index"
        align="center"
        width="50"
      />
      <el-table-column
        prop="className"
        label="分类名称"
        align="center"
        min-width="100px"
      />
      <el-table-column
        prop="classCode"
        label="分类编号"
        align="center"
        min-width="100px"
      />
      <el-table-column
        prop="classType"
        label="分类类型"
        align="center"
        min-width="100px"
      >
        <template #default="scope">
          {{ classTypeFilter(scope.row.classType) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="classDesc"
        label="分类描述"
        align="center"
        min-width="100px"
      />
      <el-table-column
        prop="createDate"
        label="创建时间"
        align="center"
        min-width="100px"
      />
      <el-table-column
        fixed="right"
        label="操作"
        align="right"
        width="150"
      >
        <template #header>
          <el-button
            type="primary"
            @click="openClassDialog(true)"
          >
            <el-icon>
              <CirclePlus />
            </el-icon>
            新增分类
          </el-button>
        </template>
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click="openClassDialog(false, scope.row.classId)"
          >
            <el-icon>
              <Edit />
            </el-icon>
            修改
          </el-button>
          <el-button
            link
            type="primary"
            size="small"
            style="color: #ff0000"
            @click="removeClass(scope.row.classId)"
          >
            <el-icon>
              <Delete />
            </el-icon>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pagination.page"
      background
      layout="prev, pager, next, total"
      :page-size="pagination.pageSize"
      :total="pagination.total"
      @current-change="currentChange"
    />

    <el-dialog
      v-model="classDialog.dialogVisible"
      :title="classDialog.title"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="50%"
      @close="closeClassDiaLog"
    >
      <el-form
        ref="classFormRef"
        :model="classForm"
        status-icon
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item
          label="分类名称"
          prop="className"
        >
          <el-input
            v-model="classForm.className"
            link
            type="primary"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="分类编号"
          prop="classCode"
        >
          <el-input
            v-model="classForm.classCode"
            link
            type="primary"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="分类类型">
          <el-select
            v-model="classForm.classType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in classTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分类描述">
          <el-input
            v-model="classForm.classDesc"
            link
            type="primary"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="classDialog.dialogVisible = false">
            取 消
          </el-button>
          <el-button
            type="primary"
            :loading="classDialog.saveFlag"
            @click="saveClass"
          >
            {{
              classDialog.saveFlag ? "保存中..." : "保 存"
            }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ClassAdmin'
}
</script>
<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import type { ElForm } from 'element-plus'
import { CirclePlus, Delete, Edit } from '@element-plus/icons-vue'
import { ClassApi } from '@/api'
import type { ClassInfo } from '@/api/class/types'
import myMessage from '@/utils/myMessage'
import { ElMessageBox, ElLoading } from 'element-plus'

interface IClassTypeItem {
  value: number;
  label: string;
}

type FormInstance = InstanceType<typeof ElForm>;

const classFormRef = ref<FormInstance>()

const pagination = reactive<GIPagination>({
  page: 1,
  pageSize: 10,
  total: 0
})

const classTableList = ref<Array<ClassInfo>>([])

const classDialog = reactive<GIDialogModel>({
  dialogVisible: false,
  isNew: true,
  title: '',
  saveFlag: false
})

const classTypeOptions: Array<IClassTypeItem> = [
  { value: 0, label: '默认分类' },
  { value: 1, label: '编程语言' },
  { value: 2, label: '开发工具' },
  { value: 3, label: '其他技能' }
]

const classForm = reactive<ClassInfo>({
  classId: 0,
  classCode: '',
  className: '',
  classType: 0,
  classDesc: ''
})

const checkClassCode: RuleValidator = (
  _: any,
  value: any,
  callback: RuleValidatorCallback
): RuleValidatorCallback => {
  if (!value.trim()) {
    return callback(new Error('请输入分类编号'))
  }
  // 正则以大写字母开始，可以包含大写字母和_组成的2-20个字符
  if (!/^[A-Z]([_A-Z]{1,19})$/.test(value)) {
    return callback(
      new Error('分类编号必须是以大写字母开始，可以包含大写字母和_组成的2-20个字符')
    )
  }
  return callback()
}

const formRules = reactive<FormRule>({
  className: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  classCode: [{ required: true, validator: checkClassCode, trigger: 'blur' }]
})

const getClassData = (page: number): void => {
  const loadingInstance = ElLoading.service({ fullscreen: true })
  ClassApi.getClassList({
    page: page,
    pageSize: pagination.pageSize
  })
    .then((res) => {
      const data = res.data
      Object.assign(pagination, {
        page: data.pagination.page,
        total: data.pagination.total
      })
      classTableList.value = data.classList
    })
    .catch(() => {
      myMessage({
        type: 'error',
        message: '获取失败'
      })
    })
    .finally(() => {
      loadingInstance.close()
    })
}

const currentChange = (page: number): void => {
  getClassData(page)
}

const openClassDialog = (isNew: boolean, classId?: string): void => {
  classDialog.isNew = isNew
  if (isNew) {
    classDialog.title = '新增分类'
  } else {
    classDialog.title = '修改分类'
    if (classId) {
      ClassApi.getClassInfo(classId)
        .then((res) => {
          Object.assign(classForm, res.data)
        })
        .catch(() => {
          myMessage({
            type: 'error',
            message: '获取失败'
          })
        })
    }
  }

  classDialog.dialogVisible = true
}

const closeClassDiaLog = (): void => {
  Object.assign(classForm, {
    classId: 0,
    classType: 0,
    classDesc: ''
  })
  classFormRef.value?.resetFields()
}

const saveClass = () => {
  classDialog.saveFlag = true
  classFormRef.value?.validate((valid) => {
    if (valid) {
      const data: ClassInfo = {
        classCode: classForm.classCode,
        className: classForm.className,
        classType: classForm.classType,
        classDesc: classForm.classDesc
      }
      submitForm(data)
        .then(() => {
          myMessage({
            type: 'success',
            message: '保存成功'
          })
          classDialog.dialogVisible = false
          getClassData(1)
        })
        .catch(() => {
          myMessage({
            type: 'error',
            message: '保存失败'
          })
        })
        .finally(() => {
          classDialog.saveFlag = false
        })
    } else {
      classDialog.saveFlag = false
    }
  })
}

const submitForm = (data: ClassInfo) => {
  if (classDialog.isNew) {
    return ClassApi.newClass(data)
  }
  data.classId = classForm.classId
  return ClassApi.updateClass(data)
}

const removeClass = (classId: string): void => {
  ElMessageBox.confirm('是否删除该分类？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      ClassApi.deleteClass(classId)
        .then(() => {
          myMessage({
            type: 'success',
            message: '删除成功'
          })
          getClassData(1)
        })
        .catch(() => {
          myMessage({
            type: 'error',
            message: '删除失败'
          })
        })
    })
    .catch(() => {
      return false
    })
}

const classTypeFilter = (value: number): string => {
  let classTypeStr = ''
  if (value === 0) {
    classTypeStr = '默认分类'
  } else if (value === 1) {
    classTypeStr = '编程语言'
  } else if (value === 2) {
    classTypeStr = '开发工具'
  } else if (value === 3) {
    classTypeStr = '其他技能'
  }
  return classTypeStr
}

onMounted(() => {
  getClassData(1)
})
</script>

<style scoped lang="scss"></style>
