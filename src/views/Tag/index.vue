<template>
    <div class="tag-page">
        <el-table
            :data="tagTableList"
            row-key="tagId"
            stripe
            style="width: 100%"
        >
            <el-table-column prop="index" align="center" width="50" />
            <el-table-column prop="tagName" label="标签名称" align="center" min-width="100px" />
            <el-table-column prop="className" label="所属分类" align="center" min-width="100px" />
            <el-table-column prop="classType" label="标签描述" align="center" min-width="100px" />
            <el-table-column prop="createDate" label="创建时间" align="center" min-width="100px" />
            <el-table-column fixed="right" label="操作" align="right" width="150">
                <template #header>
                    <el-button type="primary" @click="openTagDialog(true)">
                        <el-icon><CirclePlus /></el-icon>
                        新增标签
                    </el-button>
                </template>
                <template #default="scope">
                    <el-button
                        link
                        type="primary"
                        size="small"
                        @click="openTagDialog(false, scope.row.tagId)"
                    >
                        <el-icon><Edit /></el-icon>修改
                    </el-button>
                    <el-button
                        link
                        type="primary"
                        size="small"
                        style="color: #ff0000"
                        @click="deleteTag(scope.row.tagId)"
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
            :title="tagDialog.title"
            v-model="tagDialog.dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close="closeTagDiaLog"
            width="50%"
        >
            <el-form
                :model="tagForm"
                status-icon
                :rules="formRules"
                ref="tagFormRef"
                label-width="100px"
            >
                <el-form-item label="标签名称" prop="tagName">
                    <el-input link type="primary" v-model="tagForm.tagName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属分类" prop="classType">
                    <el-select v-model="tagForm.classType" placeholder="请选择">
                        <el-option
                            v-for="item in classTypeOptions"
                            :key="item.classId"
                            :label="item.className"
                            :value="item.classId"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标签描述">
                    <el-input link type="primary" v-model="tagForm.tagDesc" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="tagDialog.dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveTag" :loading="tagDialog.saveFlag">{{
                        tagDialog.saveFlag ? '保存中...' : '保 存'
                    }}</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
export default {
    name: 'TagAdmin'
};
</script>
<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import type { ElForm } from 'element-plus';
import { CirclePlus, Delete, Edit } from '@element-plus/icons-vue';
import { TagApi, ClassApi } from '@/api';
import { TagInfo } from '@/api/tag/types';
import { ClassInfo } from '@/api/class/types';
import myMessage from '@/utils/myMessage';
import {ElLoading, ElMessageBox} from 'element-plus';

type FormInstance = InstanceType<typeof ElForm>;

const tagFormRef = ref<FormInstance>();

const pagination = reactive<GIPagination>({
    page: 1,
    pageSize: 10,
    total: 0
});

const tagTableList = ref<Array<TagInfo>>([]);

const tagDialog = reactive<GIDialogModel>({
    dialogVisible: false,
    isNew: true,
    title: '',
    saveFlag: false
});

const formRules = reactive<FormRule>({
    tagName: [
        {
            required: true,
            message: '请输入标签名称',
            trigger: ['blur', 'change']
        }
    ],
    classType: [
        {
            required: true,
            message: '请选择所属分类',
            trigger: ['blur', 'change']
        }
    ]
});

const classTypeOptions = ref<Array<ClassInfo>>([]);

const tagForm = reactive<TagInfo>({
    tagId: 0,
    tagName: '',
    tagDesc: '',
    classType: ''
});

const getTagList = (page: number) => {
    const loadingInstance = ElLoading.service({ fullscreen: true });
    TagApi.getTagList({ page: page, pageSize: pagination.pageSize })
        .then((res) => {
            const data = res.data;
            Object.assign(pagination, {
                page: data.pagination.page,
                total: data.pagination.total
            });
            tagTableList.value = data.tagList;
        })
        .catch(() => {
            myMessage({
                type: 'error',
                message: '获取失败'
            });
        })
        .finally(() => {
            loadingInstance.close();
        });
};

const currentChange = (page: number) => {
    getTagList(page);
};

const openTagDialog = (isNew: boolean, tagId?: string) => {
    tagDialog.isNew = isNew;
    if (isNew) {
        tagDialog.title = '新增标签';
    } else {
        tagDialog.title = '修改标签';
        if (tagId) {
            TagApi.getTagInfo(tagId)
                .then((res) => {
                    Object.assign(tagForm, res.data);
                })
                .catch(() => {
                    myMessage({
                        type: 'error',
                        message: '获取信息失败'
                    });
                });
        }
    }
    tagDialog.dialogVisible = true;
};

const closeTagDiaLog = () => {
    Object.assign(tagForm, {
        tagId: 0,
        classType: '',
        tagDesc: ''
    });
    tagFormRef.value?.resetFields();
};

const saveTag = () => {
    tagDialog.saveFlag = true;
    tagFormRef.value?.validate((valid) => {
        if (valid) {
            let data = Object.assign(
                {},
                {
                    tagName: tagForm.tagName,
                    classType: tagForm.classType,
                    tagDesc: tagForm.tagDesc
                }
            );
            submitForm(data)
                .then(() => {
                    myMessage({
                        type: 'success',
                        message: '保存成功'
                    });
                    tagDialog.dialogVisible = false;
                    getTagList(1);
                })
                .catch(() => {
                    myMessage({
                        type: 'error',
                        message: '保存失败'
                    });
                })
                .finally(() => {
                    tagDialog.saveFlag = false;
                });
        } else {
            tagDialog.saveFlag = false;
        }
    });
};

const submitForm = (data: TagInfo) => {
    if (tagDialog.isNew) {
        return TagApi.newTag(data);
    }
    data.tagId = tagForm.tagId;
    return TagApi.updateTag(data);
};

const deleteTag = (tagId: string) => {
    ElMessageBox.confirm('是否删除该标签？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
        .then(() => {
            TagApi.deleteTag(tagId)
                .then(() => {
                    myMessage({
                        type: 'success',
                        message: '删除成功'
                    });
                    getTagList(1);
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

onMounted(() => {
    ClassApi.getAllClass()
        .then((res) => {
            classTypeOptions.value = res.data;
        })
        .catch(() => {
            return false;
        });

    getTagList(1);
});
</script>

<style scoped></style>
