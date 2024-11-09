<template>
  <div class="financial-recommend">
    <div class="content-wrapper">
      <!-- 顶部搜索区域 -->
      <div class="search-panel">
        <div class="search-section">
          <el-input
            v-model="searchQuery"
            placeholder="搜索金融书籍..."
            class="search-input"
            clearable
          >
            <template #append>
              <el-button :loading="loading" @click="handleSearch">
                <el-icon><Search /></el-icon>
              </el-button>
            </template>
          </el-input>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleRandomBook"
          >
            随机推荐
          </el-button>
        </div>

        <el-alert
          v-if="error"
          :title="error"
          type="error"
          show-icon
          :closable="false"
          class="error-alert"
        />
      </div>

      <!-- 图书详情区域 -->
      <div v-loading="loading" class="book-panel">
        <div class="book-detail">
          <!-- 书籍基本信息 -->
          <div class="book-header">
            <h1>{{ bookInfo.title }}</h1>
            <div class="book-content">
              <div class="book-info">
                <div class="rating">
                  <span class="score">{{ bookInfo.rating }}</span>
                  <span class="total">({{ bookInfo.ratingCount }}人评价)</span>
                </div>
                <div v-if="bookInfo.coverUrl" class="book-cover">
                  <img :src="bookInfo.coverUrl" :alt="bookInfo.title" />
                </div>
                <div class="info-items">
                  <p>作者: {{ bookInfo.author }}</p>
                  <p>出版社: {{ bookInfo.publisher }}</p>
                  <p>出版年: {{ bookInfo.publishYear }}</p>
                  <p>页数: {{ bookInfo.pages }}</p>
                  <p>定价: {{ bookInfo.price }}</p>
                  <p>ISBN: {{ bookInfo.isbn }}</p>
                  <p>丛书: {{ bookInfo.series }}</p>
                </div>
                <div v-if="bookInfo.downloadUrl" class="download-section">
                  <el-button type="primary" @click="handleDownload">
                    下载电子书
                  </el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 内容简介 -->
          <div class="book-intro">
            <h2>内容简介</h2>
            <div class="intro-content">{{ bookInfo.introduction }}</div>
          </div>

          <!-- 目录 -->
          <div class="book-catalog">
            <h2>目录</h2>
            <ul>
              <li v-for="(item, index) in bookInfo.catalog" :key="index">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getBooks, type GutendexResponse } from "@/api/book";
import { Search } from "@element-plus/icons-vue";

interface BookInfo {
  title: string;
  rating: string;
  ratingCount: string;
  author: string;
  publisher: string;
  publishYear: string;
  pages: string;
  price: string;
  isbn: string;
  series: string;
  introduction: string;
  catalog: string[];
  coverUrl: string;
  downloadUrl: string;
}

const bookInfo = ref<BookInfo>({
  title: "",
  rating: "",
  ratingCount: "",
  author: "",
  publisher: "",
  publishYear: "",
  pages: "",
  price: "",
  isbn: "",
  series: "",
  introduction: "",
  catalog: [],
  coverUrl: "",
  downloadUrl: ""
});

const searchQuery = ref("");
const loading = ref(true);
const error = ref("");

const transformBookData = (data: GutendexResponse["results"][0]): BookInfo => {
  return {
    title: data.title,
    rating: `${(data.download_count / 1000).toFixed(1)}`, // 使用下载量作为评分
    ratingCount: data.download_count.toString(),
    author: data.authors.map(a => a.name).join(", "),
    publisher: "Project Gutenberg",
    publishYear: data.authors[0]?.birth_year
      ? `${data.authors[0].birth_year} - ${data.authors[0].death_year}`
      : "未知",
    pages: "电子书",
    price: "免费",
    isbn: data.id.toString(),
    series: data.bookshelves.join(", "),
    introduction: data.subjects.join("\n"),
    catalog: data.bookshelves,
    coverUrl: data.formats["image/jpeg"] || "",
    downloadUrl:
      data.formats["application/epub+zip"] || data.formats["text/html"] || ""
  };
};

const fetchBookInfo = async (retryCount = 0) => {
  try {
    loading.value = true;
    error.value = "";

    const response = await getBooks();

    if (response?.results && response.results.length > 0) {
      const randomIndex = Math.floor(Math.random() * response.results.length);
      bookInfo.value = transformBookData(response.results[randomIndex]);
    } else {
      bookInfo.value = {
        title: "股市长线法宝（原书第5版）",
        rating: "8.6",
        ratingCount: "494",
        author: "【美】杰里米 J.西格尔 (Jeremy J.Siegel)",
        publisher: "机械工业出版社",
        publishYear: "2015-1-1",
        pages: "383",
        price: "59.00元",
        isbn: "9787111488408",
        series: "华章经典·金融投资（珍藏版）",
        introduction: `自本书第4版面市以来，全球股市发生了极大的变化。2008年金融危机是自大萧条以来最深重的一次熊市，而新兴市场的持续增长只是直接影响全世界所有投资组合的若干意外事件之一。`,
        catalog: [
          "序言",
          "前言",
          "致谢",
          "译者序",
          "第一部分 股票收益率：过去、现在及未来"
        ],
        coverUrl: "",
        downloadUrl: ""
      };
      error.value = "暂时无法获取在线图书，显示默认内容";
    }
  } catch (err: any) {
    console.error("Error fetching book info:", err);
    error.value = "获取图书信息失败，显示默认内容";

    bookInfo.value = {
      title: "股市长线法宝（原书第5版）",
      rating: "8.6",
      ratingCount: "494",
      author: "【美】杰里米 J.西格尔 (Jeremy J.Siegel)",
      publisher: "机械工业出版社",
      publishYear: "2015-1-1",
      pages: "383",
      price: "59.00元",
      isbn: "9787111488408",
      series: "华章经典·金融投资（珍藏版）",
      introduction: `自本书第4版面市以来，全球股市发生了极大的变化。2008年金融危机是自大萧条以来最深重的一次熊市，而新兴市场的持续增长只是直接影响全世界所有投资组合的若干意外事件之一。`,
      catalog: [
        "序言",
        "前言",
        "致谢",
        "译者序",
        "第一部分 股票收益率：过去、现在及未来"
      ],
      coverUrl: "",
      downloadUrl: ""
    };
  } finally {
    loading.value = false;
  }
};

// 添加下载处理方法
const handleDownload = () => {
  if (bookInfo.value.downloadUrl) {
    window?.open(bookInfo.value.downloadUrl, "_blank");
  }
};

// 搜索处理函数
const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    return;
  }

  try {
    loading.value = true;
    error.value = "";

    const response = await getBooks({
      search: searchQuery.value
    });

    if (response?.results && response.results.length > 0) {
      // 显示第一个搜索结果
      bookInfo.value = transformBookData(response.results[0]);
    } else {
      error.value = "未找到相关书籍，显示默认内容";
      useDefaultBook();
    }
  } catch (err) {
    console.error("Search error:", err);
    error.value = "搜索失败，显示默认内容";
    useDefaultBook();
  } finally {
    loading.value = false;
  }
};

// 随机推荐处理函数
const handleRandomBook = () => {
  fetchBookInfo();
};

// 使用默认书籍数据
const useDefaultBook = () => {
  bookInfo.value = {
    title: "股市长线法宝（原书第5版）",
    rating: "8.6",
    ratingCount: "494",
    author: "【美】杰里米 J.西格尔 (Jeremy J.Siegel)",
    publisher: "机械工业出版社",
    publishYear: "2015-1-1",
    pages: "383",
    price: "59.00元",
    isbn: "9787111488408",
    series: "华章经典·金融投资（珍藏版）",
    introduction: `自本书第4版面市以来，全球股市发生了极大的变化。2008年金融危机是自大萧条以来最深重的一次熊市，而新兴市场的持续增长只是直接影响全世界所有投资组合的若干意外事件之一。`,
    catalog: [
      "序言",
      "前言",
      "致谢",
      "译者序",
      "第一部分 股票收益率：过去、现在及未来"
    ],
    coverUrl: "",
    downloadUrl: ""
  };
};

onMounted(() => {
  fetchBookInfo();
});
</script>

<style scoped lang="scss">
.financial-recommend {
  height: 100vh;
  overflow: hidden;
  padding: 20px;
  background: #f5f7fa;

  .content-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 20px;
    max-width: 1600px;
    margin: 0 auto;

    // 顶部搜索面板
    .search-panel {
      padding: 20px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

      .search-section {
        display: flex;
        align-items: center;
        gap: 16px;

        .search-input {
          flex: 1;
          max-width: 500px;
        }

        .el-button {
          min-width: 120px;
        }
      }

      .error-alert {
        margin-top: 16px;
      }
    }

    // 图书面板
    .book-panel {
      flex: 1;
      overflow-y: auto;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

      .book-detail {
        padding: 30px;

        .book-header {
          margin-bottom: 30px;

          h1 {
            font-size: 24px;
            color: #333;
            margin-bottom: 20px;
          }

          .book-content {
            .book-info {
              display: flex;
              flex-direction: column;
              gap: 20px;

              .rating {
                .score {
                  font-size: 28px;
                  color: #494949;
                  font-weight: bold;
                }

                .total {
                  color: #666;
                  margin-left: 5px;
                }
              }

              .book-cover {
                width: 200px;
                align-self: center;

                img {
                  width: 100%;
                  height: auto;
                  border-radius: 4px;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }
              }

              .info-items {
                p {
                  margin: 8px 0;
                  color: #666;
                }
              }

              .download-section {
                align-self: center;
              }
            }
          }
        }

        .book-intro,
        .book-catalog {
          margin-top: 30px;

          h2 {
            font-size: 18px;
            color: #494949;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
          }

          .intro-content {
            line-height: 1.8;
            color: #333;
          }

          ul {
            list-style: none;
            padding: 0;

            li {
              padding: 8px 0;
              color: #666;
            }
          }
        }
      }
    }
  }
}
</style>
