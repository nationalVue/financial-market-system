<template>
  <div class="financial-article">
    <!-- 文章信息表单部分 -->
    <div class="article-form">
      <el-form :model="articleForm" label-width="80px" class="form-container">
        <el-form-item label="文章标题">
          <el-input v-model="articleForm.title" placeholder="请输入文章标题" />
        </el-form-item>

        <el-form-item label="文章分类">
          <el-select v-model="articleForm.category" placeholder="请选择分类">
            <el-option label="财经新闻" value="news" />
            <el-option label="市场分析" value="analysis" />
            <el-option label="投资教程" value="tutorial" />
            <el-option label="理财知识" value="knowledge" />
          </el-select>
        </el-form-item>

        <el-form-item label="关键词">
          <el-select
            v-model="articleForm.tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请输入关键词（可多选）"
          >
            <el-option
              v-for="tag in tagOptions"
              :key="tag.value"
              :label="tag.label"
              :value="tag.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="文章摘要">
          <el-input
            v-model="articleForm.summary"
            type="textarea"
            :rows="3"
            placeholder="请输入文章摘要"
          />
        </el-form-item>
      </el-form>
    </div>

    <!-- 富文本编辑器部分 -->
    <div class="editor-section">
      <div class="editor-label">文章内容</div>
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        v-model="valueHtml"
        style="height: 500px; overflow-y: hidden"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
      />
    </div>

    <!-- 操作按钮部分 -->
    <div class="article-actions">
      <el-button type="primary" @click="handleSubmit">发布文章</el-button>
      <el-button @click="handleSaveDraft">保存草稿</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, onBeforeUnmount } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { IDomEditor } from "@wangeditor/editor";
import "@wangeditor/editor/dist/css/style.css";
import { ElMessage } from "element-plus";

// 编辑器实例，使用 IDomEditor 类型
const editorRef = shallowRef<IDomEditor>();

// 内容 HTML
const valueHtml = ref("");

// 编辑器配置
const mode = "default";
const editorConfig = {
  placeholder: "请输入内容...",
  autoFocus: false,
  MENU_CONF: {}
};

// 工具栏配置
const toolbarConfig = {
  toolbarKeys: [
    "headerSelect",
    "blockquote",
    "bold",
    "underline",
    "italic",
    "through",
    "fontSize",
    "fontFamily",
    "lineHeight",
    "foreColor",
    "backColor",
    "bulletedList",
    "numberedList",
    "justifyLeft",
    "justifyCenter",
    "justifyRight",
    "emotion",
    "insertLink",
    "insertImage",
    "insertTable",
    "codeBlock",
    "divider",
    "undo",
    "redo"
  ]
};

// 文章表单数据
const articleForm = ref({
  title: "",
  category: "",
  tags: [],
  summary: ""
});

// 预设的标签选项
const tagOptions = [
  { value: "股票", label: "股票" },
  { value: "基金", label: "基金" },
  { value: "理财", label: "理财" },
  { value: "投资", label: "投资" },
  { value: "市场", label: "市场" }
];

// 提交文章
const handleSubmit = async () => {
  if (!articleForm.value.title) {
    ElMessage.warning("请输入文章标题");
    return;
  }
  if (!articleForm.value.category) {
    ElMessage.warning("请选择文章分类");
    return;
  }
  if (!valueHtml.value || valueHtml.value === "<p>请输入内容...</p>") {
    ElMessage.warning("请输入文章内容");
    return;
  }

  try {
    const articleData = {
      ...articleForm.value,
      content: valueHtml.value,
      status: "published"
    };
    console.log("提交文章数据：", articleData);
    // TODO: 调用API保存文章
    ElMessage.success("文章发布成功");
  } catch (error) {
    console.error("发布失败：", error);
    ElMessage.error("发布失败，请重试");
  }
};

// 保存草稿
const handleSaveDraft = async () => {
  try {
    const draftData = {
      ...articleForm.value,
      content: valueHtml.value,
      status: "draft"
    };
    console.log("保存草稿：", draftData);
    // TODO: 调用API保存草稿
    ElMessage.success("草稿保存成功");
  } catch (error) {
    console.error("保存草稿失败：", error);
    ElMessage.error("保存失败，请重试");
  }
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

// 编辑器创建完成时的回调
const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor;
  // 设置编辑器为可编辑状态
  if (editor) {
    editor.enable();
  }
};
</script>

<style scoped>
.financial-article {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.article-form {
  margin-bottom: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.form-container {
  max-width: 100%;
}

.editor-section {
  margin-bottom: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
}

.editor-label {
  padding: 12px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e4e7ed;
  font-weight: 500;
  color: #333;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-textarea__inner) {
  font-family: Arial, sans-serif;
}

.article-actions {
  padding: 20px 0;
  text-align: center;
  border-top: 1px solid #e4e7ed;
  margin-top: 20px;
}

.el-button {
  margin: 0 10px;
  padding: 12px 25px;
}

:deep(.w-e-toolbar) {
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;
}

:deep(.w-e-text-container) {
  border: none !important;
}

/* 添加编辑器相关样式 */
:deep(.w-e-text-container) {
  background-color: #fff !important;
  min-height: 500px !important;
}

:deep(.w-e-toolbar) {
  background-color: #fff !important;
}

:deep(.w-e-text-placeholder) {
  color: #999 !important;
}
</style>
