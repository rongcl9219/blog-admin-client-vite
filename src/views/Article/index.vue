<template>
    <div class="article-page">
        <div class="search-form">
            <label>文章状态：</label>
            <el-select v-model="articleStatus" placeholder="请选择" @change="getArticle(1)">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
            </el-select>
            <el-button style="margin-left: 15px" type="primary" @click="openArticleDrawer(true)"
                >新建</el-button
            >
        </div>
        <template v-if="articleList.length === 0">
            <NoData />
        </template>
        <template v-else>
            <div class="article-list">
                <div class="article-item" v-for="article in articleList" :key="article.articleId">
                    <div class="article-item-con">
                        <div class="article-item-left">
                            <p class="article-title">
                                {{ article.articleTitle }}
                                <el-tooltip
                                    placement="right"
                                    :content="article.isPublish === 0 ? '未发布' : '已发布'"
                                    effect="customized"
                                >
                                    <span
                                        :style="{
                                            color: article.isPublish === 0 ? '#E6A23C' : '#67C23A',
                                            cursor: 'pointer'
                                        }"
                                        @click="
                                            updateArticlePublish(
                                                article.articleId,
                                                article.isPublish
                                            )
                                        "
                                        ><el-icon><Promotion /></el-icon
                                    ></span>
                                </el-tooltip>
                            </p>
                            <p class="article-keyword">{{ article.articleKeyword }}</p>
                            <p class="article-info">{{ article.articleInfo }}</p>
                            <p class="article-type">
                                <el-tag v-for="item in article.classTypeList" :key="item.classId">{{
                                    item.className
                                }}</el-tag>
                            </p>
                            <p class="article-type">
                                <el-tag
                                    type="success"
                                    v-for="item in article.tagTypeList"
                                    :key="item.tagId"
                                    >{{ item.tagName }}</el-tag
                                >
                            </p>
                        </div>
                        <div class="article-item-right">
                            <p class="article-time">{{ article.createDate }}</p>
                            <div class="article-cover" @click="goView(article.articleId)">
                                <img :src="article.articleCover" alt="" />
                            </div>
                            <div class="item-info-oper">
                                <template v-if="articleStatus === 3">
                                    <el-button
                                        link
                                        type="primary"
                                        @click="reversalArticle(article.articleId)"
                                        >恢复删除</el-button
                                    >
                                </template>
                                <template v-else-if="articleStatus === 0 || articleStatus === 2">
                                    <el-button
                                        link
                                        type="primary"
                                        @click="openArticleDrawer(false, article.articleId)"
                                        >编辑信息</el-button
                                    >
                                    <el-button
                                        link
                                        type="primary"
                                        @click="openUpdateContent(article.articleId)"
                                        >编辑文章</el-button
                                    >
                                    <el-popover placement="bottom" trigger="hover" width="60px">
                                        <template #reference>
                                            <el-button link type="primary">
                                                <svg-icon icon-class="round-menu" />
                                            </el-button>
                                        </template>
                                        <template #default>
                                            <el-button
                                                type="danger"
                                                round
                                                @click="removeArticle(article.articleId)"
                                                >删除</el-button
                                            >
                                        </template>
                                    </el-popover>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <el-pagination
                background
                layout="prev, pager, next"
                :page-size="pagination.pageSize"
                v-model:current-page="pagination.page"
                :total="pagination.total"
                @current-change="currentChange"
            />
        </template>

        <el-drawer v-model="articleDialog.dialogVisible" @close="closeArticleDrawer" :size="600">
            <template #header>
                <h4>{{ articleDialog.title }}</h4>
            </template>
            <template #default>
                <el-scrollbar>
                    <el-form
                        :model="articleForm"
                        status-icon
                        :rules="formRules"
                        ref="articleFormRef"
                        label-width="100px"
                    >
                        <el-form-item label="文章标题" prop="articleTitle">
                            <el-input
                                link
                                type="primary"
                                v-model="articleForm.articleTitle"
                                autocomplete="off"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="文章关键词">
                            <el-input
                                link
                                type="primary"
                                v-model="articleForm.articleKeyword"
                                autocomplete="off"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="文章简介" prop="articleInfo">
                            <el-input
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 4 }"
                                v-model="articleForm.articleInfo"
                                autocomplete="off"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="文章封面" prop="articleCoverInfo">
                            <template v-if="articleForm.articleCoverInfo && articleForm.articleCoverInfo.length > 0">
                                <div
                                    style="
                                        float: left;
                                        width: 60px;
                                        height: 60px;
                                        margin-right: 20px;
                                        border-radius: 6px;
                                        overflow: hidden;
                                    "
                                >
                                    <img
                                        style="width: 100%; height: 100%; cursor: pointer"
                                        :src="articleForm.articleCoverInfo[0].url"
                                        alt=""
                                    />
                                </div>
                            </template>
                            <el-button type="primary" @click="articleDialog.uploadImgVisible = true"
                                >上传封面
                            </el-button>
                        </el-form-item>
                        <el-form-item label="所属类型" prop="classType">
                            <el-select
                                v-model="articleForm.classType"
                                style="width: 100%"
                                multiple
                                @visible-change="classTypeChange"
                                @remove-tag="classTypeRemove"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="item in classTypeOptions"
                                    :key="item.classId"
                                    :label="item.className"
                                    :value="item.classId"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="文章标签" prop="tagType">
                            <el-select
                                v-model="articleForm.tagType"
                                style="width: 100%"
                                no-data-text="无数据"
                                multiple
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="item in articleDialog.tagTypeOptions"
                                    :key="item.tagId"
                                    :label="item.tagName"
                                    :value="item.tagId"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-scrollbar>
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button @click="articleDialog.dialogVisible = false">取消</el-button>
                    <el-button
                        type="primary"
                        @click="submitArticle"
                        :loading="articleDialog.btnLoading"
                    >
                        {{ articleDialog.btnLoading ? '保存中...' : '保存' }}
                    </el-button>
                </div>
            </template>
        </el-drawer>

        <UploadImage
            v-model:imgList="articleForm.articleCoverInfo"
            v-model:uploadImgVisible="articleDialog.uploadImgVisible"
            :imgWidth="100"
            :imgHeight="100"
            thumbnail="articleCover"
            @image-upload-success="imageUploadSuccess"
            :limitNum="1"
        />

        <el-dialog
            v-model="editContentModel.mdEditorVisible"
            title="标题"
            fullscreen
            center
            :show-close="false"
            @close="closeUpdateContent"
            custom-class="markdown-content"
        >
            <template #default>
                <MdEditor
                    v-model:content="editContentModel.articleContent"
                    @on-save="saveArticleContent"
                />
            </template>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="editContentModel.mdEditorVisible = false">返回</el-button>
                    <el-button type="primary" @click="saveArticleContent">保存</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
export default {
    name: 'ArticleAdmin'
};
</script>
<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { ArticleInfo } from '@/api/article/types';
import { TagInfo } from '@/api/tag/types';
import { ClassInfo } from '@/api/class/types';
import { TagApi, ClassApi, ArticleApi } from '@/api';
import NoData from '@/components/NoData/index.vue';
import { Promotion } from '@element-plus/icons-vue';
import UploadImage from '@/components/UploadImage/index.vue';
import MdEditor from '@/components/MdEditor/index.vue';
import type { ElForm } from 'element-plus';
import { ElLoading, ElMessageBox, ElNotification } from 'element-plus';
import myMessage from '@/utils/myMessage';

interface IOptions {
    value: number;
    label: string;
}

interface Article extends ArticleInfo {
    articleId: string;
    isPublish: number;
    createUsername: string;
    createDate: string;
    isDelete: number;
    classTypeList: Array<ClassInfo>;
    tagTypeList: Array<TagInfo>;
}

interface EditModel {
    articleId: string;
    articleContent: string;
    mdEditorVisible: boolean;
}

interface DialogModel extends GIDialogModel {
    btnLoading: boolean;
    uploadImgVisible: boolean;
    tagTypeOptions: Array<any>;
}

type FormInstance = InstanceType<typeof ElForm>;

const articleFormRef = ref<FormInstance>();

const articleStatus = ref(0);

const options = reactive<Array<IOptions>>([
    {
        value: 0,
        label: '全部'
    },
    {
        value: 1,
        label: '已发布'
    },
    {
        value: 2,
        label: '未发布'
    },
    {
        value: 3,
        label: '已删除'
    }
]);

const articleList = ref<Array<Article>>([]);

const allTagList = ref<Array<TagInfo>>([]);

const classTypeOptions = ref<Array<ClassInfo>>([]);

const pagination = reactive<GIPagination>({
    page: 1,
    pageSize: 10,
    total: 0
});

const articleDialog = reactive<DialogModel>({
    title: '',
    isNew: true,
    dialogVisible: false,
    btnLoading: false,
    uploadImgVisible: false,
    tagTypeOptions: []
});

const articleForm = reactive<ArticleInfo>({
    articleId: '',
    articleTitle: '',
    articleSubtitle: '',
    articleKeyword: '',
    articleInfo: '',
    classType: [],
    tagType: [],
    articleCoverInfo: []
});

const formRules = reactive<FormRule>({
    articleTitle: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
    articleInfo: [{ required: true, message: '请输入文章简介', trigger: 'blur' }],
    articleCoverInfo: [{ required: true, message: '请选择文章封面', trigger: 'blur' }],
    classType: [{ required: true, message: '请选择所属分类', trigger: 'change' }],
    tagType: [{ required: true, message: '请选择所属标签', trigger: 'change' }]
});

const editContentModel = reactive<EditModel>({
    articleId: '',
    articleContent: '',
    mdEditorVisible: false
});

const getArticle = (page: number) => {
    const pageLoading = ElLoading.service();
    ArticleApi.getArticleList({
        page: page,
        pageSize: pagination.pageSize,
        articleStatus: articleStatus.value
    })
        .then((res) => {
            const data = res.data;
            Object.assign(pagination, data.pagination);
            articleList.value = data.articleList;
        })
        .catch(() => {
            myMessage({
                type: 'error',
                message: '获取失败'
            });
        })
        .finally(() => {
            pageLoading.close();
        });
};

const updateArticlePublish = (articleId: string, isPublish: number) => {
    const tip = isPublish === 0 ? '发布' : '取消发布';
    ArticleApi.updatePublish(articleId, isPublish)
        .then(() => {
            myMessage({
                type: 'success',
                message: `${tip}成功`
            });
            getArticle(1);
        })
        .catch(() => {
            myMessage({
                type: 'error',
                message: `${tip}成功`
            });
        });
};

const removeArticle = (articleId: string) => {
    ElMessageBox.confirm('确定删除该文章？', '提示', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '删除'
    })
        .then(() => {
            ArticleApi.deleteArticle(articleId)
                .then(() => {
                    myMessage({
                        type: 'success',
                        message: '删除成功'
                    });
                    getArticle(1);
                })
                .catch(() => {
                    myMessage({
                        type: 'error',
                        message: '删除失败'
                    });
                });
        })
        .catch(() => {
            myMessage({
                showClose: true,
                type: 'warning',
                message: '取消删除'
            });
        });
};

const reversalArticle = (articleId: string) => {
    ArticleApi.recoverArticle(articleId)
        .then(() => {
            myMessage({
                type: 'success',
                message: '恢复成功'
            });
            getArticle(1);
        })
        .catch(() => {
            myMessage({
                type: 'error',
                message: '删除失败'
            });
        });
};

const classTypeChange = () => {
    articleDialog.tagTypeOptions = [];
    const tagTypeOptionId: Array<any> = [];
    allTagList.value.forEach((tag) => {
        if ((articleForm.classType as Array<number>).indexOf(Number(tag.classType)) > -1) {
            articleDialog.tagTypeOptions.push(tag);
            tagTypeOptionId.push(tag.tagId);
        }
    });
    if (articleForm.tagType.length > 0) {
        articleForm.tagType = (articleForm.tagType as Array<number>).filter((tag) => {
            return tagTypeOptionId.indexOf(tag) > -1;
        });
    }
};

const classTypeRemove = (val: number) => {
    const tagArr = allTagList.value.reduce((arr: Array<any>, cur: TagInfo) => {
        if (Number(cur.classType) === val) {
            arr.push(cur.tagId);
        }
        return arr;
    }, []);

    articleForm.tagType = (articleForm.tagType as Array<number>).filter((tag) => {
        return tagArr.indexOf(tag) === -1;
    });
};

const openArticleDrawer = (isNew: boolean, articleId?: string) => {
    articleDialog.isNew = isNew;
    articleDialog.title = isNew ? '新增文章' : '编辑文章';
    articleDialog.dialogVisible = true;
    if (!isNew && articleId) {
        ArticleApi.getArticleInfo(articleId)
            .then((res) => {
                const data: any = res.data;
                Object.assign(articleForm, {
                    articleId: data.articleId,
                    articleTitle: data.articleTitle,
                    articleKeyword: data.articleKeyword,
                    articleInfo: data.articleInfo,
                    articleCoverInfo: [data.articleCoverInfo],
                    classType: data.classType.split(',').map(Number),
                    tagType: data.tagType.split(',').map(Number)
                });
                classTypeChange();
            })
            .catch(() => {
                myMessage({
                    type: 'error',
                    message: '获取文章信息失败'
                });
            })
            .finally(() => {
                articleDialog.loading = false;
            });
    }
};

const closeArticleDrawer = () => {
    Object.assign(articleForm, {
        articleId: '',
        articleKeyword: '',
        articleCoverInfo: []
    });
    articleDialog.tagTypeOptions = [];
    articleDialog.isNew = true;
    articleFormRef.value?.resetFields();
};

const submitArticle = () => {
    if (articleDialog.btnLoading) {
        return false;
    }
    articleDialog.btnLoading = true;

    articleFormRef.value?.validate((valid) => {
        if (valid) {
            const articleCoverArr = articleForm.articleCoverInfo as Array<GIFileInfo>;
            const articleData: ArticleInfo = {
                articleTitle: articleForm.articleTitle,
                articleKeyword: articleForm.articleKeyword,
                articleInfo: articleForm.articleInfo,
                articleCover: articleCoverArr[0].key,
                classType: (articleForm.classType as Array<number>).join(','),
                tagType: (articleForm.tagType as Array<number>).join(',')
            };
            saveArticle(articleData)
                .then(() => {
                    myMessage({
                        type: 'success',
                        message: `${articleDialog.title}成功`
                    });
                    const page = articleDialog.isNew ? 1 : pagination.page;
                    getArticle(page);
                    articleDialog.dialogVisible = false;
                })
                .catch(() => {
                    myMessage({
                        type: 'error',
                        message: `${articleDialog.title}失败`
                    });
                })
                .finally(() => {
                    articleDialog.btnLoading = false;
                });
        } else {
            articleDialog.btnLoading = false;
        }
    });
};

const saveArticle = (articleData: ArticleInfo) => {
    if (!articleDialog.isNew && articleForm.articleId) {
        articleData.articleId = articleForm.articleId;
        return ArticleApi.editArticle(articleData);
    }
    return ArticleApi.newArticle(articleData);
};

const imageUploadSuccess = () => {
    articleFormRef.value?.clearValidate('articleCoverInfo');
};

const openUpdateContent = (articleId: string) => {
    const load = ElLoading.service();
    editContentModel.articleId = articleId;

    ArticleApi.getContent(articleId)
        .then((res) => {
            editContentModel.articleContent = res.data.articleContent || '';
        })
        .catch(() => {
            myMessage({
                type: 'error',
                message: '获取内容失败'
            });
        })
        .finally(() => {
            load.close();
        });

    editContentModel.mdEditorVisible = true;
};

const closeUpdateContent = () => {
    editContentModel.articleContent = '';
    editContentModel.articleId = '';
};

const saveArticleContent = () => {
    const load = ElLoading.service({
        text: '保存中...'
    });
    ArticleApi.saveContent(editContentModel.articleId, editContentModel.articleContent)
        .then(() => {
            ElNotification({
                type: 'success',
                message: '保存成功',
                duration: 2000
            });
        })
        .catch(() => {
            ElNotification({
                type: 'error',
                message: '保存失败',
                duration: 2000
            });
        })
        .finally(() => {
            load.close();
        });
};

const goView = (id: string) => {
    window.open(`/articleView?articleId=${id}`);
};

const currentChange = (page: number): void => {
    getArticle(page);
};

onMounted(() => {
    // 获取所有分类
    ClassApi.getAllClass()
        .then((res) => {
            classTypeOptions.value = res.data;
        })
        .catch();
    // 获取所有标签
    TagApi.getAllTag()
        .then((res) => {
            allTagList.value = res.data;
        })
        .catch();
    getArticle(1);
});
</script>

<style lang="scss">
.article-list {
    padding: 20px 0;

    .article-item {
        padding: 10px 0;
        border-bottom: 1px dotted #ddd;

        p {
            margin-bottom: 5px;
        }
    }

    .article-item-con {
        display: flex;
        background-color: #f9f9f9;
        border-radius: 5px;
        padding: 5px;
    }

    .article-item-left {
        flex: 1;
        padding-right: 30px;

        .article-title {
            font-size: 22px;
            font-weight: 500;
            color: #222;
            word-wrap: break-word;
            word-break: break-word;
        }

        .article-info {
            max-height: 40px;
            line-height: 20px;
            font-size: 14px;
            font-family: monospace;
            text-overflow: ellipsis;
            white-space: normal;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            -webkit-line-clamp: 2;
            color: #5a5e66;
        }

        .article-keyword {
            font-size: 14px;
            font-family: fangsong;
            font-weight: 500;
            line-height: 20px;
        }
    }

    .article-item-right {
        text-align: right;

        .article-time {
            height: 24px;
            line-height: 24px;
            color: #999;
            font-size: 14px;
        }

        .article-cover {
            display: inline-block;
            width: 125px;
            height: 100px;
            cursor: pointer;

            img {
                width: 100%;
                height: 100%;
                object-fit: fill;
                object-position: center;
            }
        }
    }

    .el-tag {
        margin-right: 5px;
    }
}

.el-popover.el-popper {
    min-width: auto;
}

.el-popper {
    &.is-customized,
    .el-popper__arrow::before {
        background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
    }
}

.markdown-content {
    .el-dialog__body {
        height: calc(100vh - 175px);
    }

    #md-editor-v3 {
        height: 100%;
    }
}
</style>
