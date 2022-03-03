<template>
    <div class="class-page">
        <el-table
            v-loading="classTableLoading"
            :data="classTableList"
            row-key="classId"
            stripe
            style="width: 100%"
        >
            <el-table-column prop="index" align="center" width="50" />
            <el-table-column prop="className" label="分类名称" align="center" min-width="100px" />
            <el-table-column prop="classCode" label="分类编号" align="center" min-width="100px" />
            <el-table-column prop="classType" label="分类类型" align="center" min-width="100px">
                <template #default="scope">
                    {{ classTypeFilter(scope.row.classType) }}
                </template>
            </el-table-column>
            <el-table-column prop="classDesc" label="分类描述" align="center" min-width="100px" />
            <el-table-column prop="createDate" label="创建时间" align="center" min-width="100px" />
            <el-table-column fixed="right" label="操作" align="right" width="150">
                <template #header>
                    <el-button type="primary" @click="openClassDialog(true)">
                        <el-icon><CirclePlus /></el-icon>
                        新增分类
                    </el-button>
                </template>
                <template #default="scope">
                    <el-button
                        type="text"
                        size="small"
                        @click="openClassDialog(false, scope.row.classId)"
                    >
                        <el-icon><Edit /></el-icon>修改
                    </el-button>
                    <el-button
                        type="text"
                        size="small"
                        style="color: #ff0000"
                        @click="removeClass(scope.row.classId)"
                        ><el-icon><Delete /></el-icon>删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            background
            layout="prev, pager, next, total"
            :page-size="pagination.pageSize"
            v-model:current-page="pagination.page"
            :total="pagination.total"
            @current-change="currentChange"
        >
        </el-pagination>

        <el-dialog
            :title="classDialog.title"
            v-model="classDialog.dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close="closeClassDiaLog"
            width="50%"
        >
            <el-form
                :model="classForm"
                status-icon
                :rules="formRules"
                v-loading="classDialog.loading"
                ref="classFormRef"
                label-width="100px"
            >
                <el-form-item label="分类名称" prop="className">
                    <el-input
                        type="text"
                        v-model="classForm.className"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="分类编号" prop="classCode">
                    <el-input
                        type="text"
                        v-model="classForm.classCode"
                        autocomplete="off"
                    ></el-input>
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
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分类描述">
                    <el-input
                        type="text"
                        v-model="classForm.classDesc"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="classDialog.dialogVisible = false"
                    >取 消</el-button
                    >
                    <el-button
                        type="primary"
                        @click="saveClass"
                        :loading="classDialog.saveFlag"
                    >{{
                            classDialog.saveFlag ? "保存中..." : "保 存"
                        }}</el-button
                    >
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
export default {
    name: 'ClassAdmin'
};
</script>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import type { ElForm } from 'element-plus';
import { CirclePlus, Delete, Edit } from '@element-plus/icons-vue';
import { ClassApi } from '@/api';
import { ClassInfo } from '@/api/class/types';
import myMessage from '@/utils/myMessage';
import { ElMessageBox } from 'element-plus';

interface IClassTypeItem {
    value: number;
    label: string;
}

type FormInstance = InstanceType<typeof ElForm>;

const classFormRef = ref<FormInstance>();

const pagination = ref<GIPagination>({
    page: 1,
    pageSize: 10,
    total: 0
});

const classTableList = ref<Array<ClassInfo>>([]);

const classTableLoading = ref(false);

const classDialog = ref<GIDialogModel>({
    dialogVisible: false,
    isNew: true,
    title: '',
    loading: false,
    saveFlag: false
});

const classTypeOptions: Array<IClassTypeItem> = [
    { value: 0, label: '默认分类' },
    { value: 1, label: '编程语言' },
    { value: 2, label: '开发工具' },
    { value: 3, label: '其他技能' }
];

const classForm = ref<ClassInfo>({
    classId: 0,
    classCode: '',
    className: '',
    classType: 0,
    classDesc: ''
});

const checkClassCode: RuleValidator = (
    rule: any,
    value: any,
    callback: RuleValidatorCallback
): RuleValidatorCallback => {
    if (!value.trim()) {
        return callback(new Error('请输入分类编号'));
    }
    // 正则以大写字母开始，可以包含大写字母和_组成的2-20个字符
    if (!/^[A-Z]([_A-Z]{1,19})$/.test(value)) {
        return callback(
            new Error('分类编号必须是以大写字母开始，可以包含大写字母和_组成的2-20个字符')
        );
    }
    return callback();
};

const formRules = ref<FormRule>({
    className: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
    classCode: [{ required: true, validator: checkClassCode, trigger: 'blur' }]
});

const getClassData = (page: number): void => {
    classTableLoading.value = true;

    ClassApi.getClassList({
        page: page,
        pageSize: pagination.value.pageSize
    })
        .then((res) => {
            const data = res.data;
            Object.assign(pagination.value, {
                page: data.pagination.page,
                total: data.pagination.total
            });
            classTableList.value = data.classList;
        })
        .catch(() => {
            myMessage({
                type: 'error',
                message: '获取失败'
            });
        })
        .finally(() => {
            classTableLoading.value = false;
        });
};

const currentChange = (page: number): void => {
    getClassData(page);
};

const openClassDialog = (isNew: boolean, classId?: string): void => {
    classDialog.value.isNew = isNew;
    if (isNew) {
        classDialog.value.title = '新增分类';
    } else {
        classDialog.value.title = '修改分类';
        classDialog.value.loading = true;
        if (classId) {
            ClassApi.getClassInfo(classId)
                .then((res) => {
                    Object.assign(classForm.value, res.data);
                })
                .catch(() => {
                    myMessage({
                        type: 'error',
                        message: '获取失败'
                    });
                })
                .finally(() => {
                    classDialog.value.loading = false;
                });
        }
    }

    classDialog.value.dialogVisible = true;
};

const closeClassDiaLog = (): void => {
    Object.assign(classForm.value, {
        classId: 0,
        classType: 0,
        classDesc: ''
    });
    classFormRef.value?.resetFields();
};

const saveClass = () => {
    classDialog.value.saveFlag = true;
    classDialog.value.loading = true;
    classFormRef.value?.validate((valid) => {
        if (valid) {
            const data: ClassInfo = {
                classCode: classForm.value.classCode,
                className: classForm.value.className,
                classType: classForm.value.classType,
                classDesc: classForm.value.classDesc
            };
            submitForm(data)
                .then(() => {
                    myMessage({
                        type: 'success',
                        message: '保存成功'
                    });
                    classDialog.value.dialogVisible = false;
                    getClassData(1);
                })
                .catch(() => {
                    myMessage({
                        type: 'error',
                        message: '保存失败'
                    });
                })
                .finally(() => {
                    classDialog.value.saveFlag = false;
                    classDialog.value.loading = false;
                });
        } else {
            classDialog.value.saveFlag = false;
            classDialog.value.loading = false;
        }
    });
};

const submitForm = (data: ClassInfo) => {
    if (classDialog.value.isNew) {
        return ClassApi.newClass(data);
    }
    data.classId = classForm.value.classId;
    return ClassApi.updateClass(data);
};

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
                    });
                    getClassData(1);
                })
                .catch(() => {
                    myMessage({
                        type: 'error',
                        message: '删除失败'
                    });
                });
        })
        .catch(() => {
            return false;
        });
};

const classTypeFilter = (value: number): string => {
    let classTypeStr = '';
    if (value === 0) {
        classTypeStr = '默认分类';
    } else if (value === 1) {
        classTypeStr = '编程语言';
    } else if (value === 2) {
        classTypeStr = '开发工具';
    } else if (value === 3) {
        classTypeStr = '其他技能';
    }
    return classTypeStr;
};

onMounted(() => {
    getClassData(1);
});
</script>

<style scoped lang="scss"></style>
