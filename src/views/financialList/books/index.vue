<template>
  <div class="financial-books">
    <!-- 搜索和筛选区域 -->
    <el-card class="filter-section">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="searchQuery"
            placeholder="搜索书名或作者"
            prefix-icon="Search"
            clearable
            @input="handleSearch"
          />
        </el-col>
        <el-col :span="6">
          <el-select
            v-model="selectedCategory"
            placeholder="选择分类"
            @change="handleCategoryChange"
          >
            <el-option
              v-for="section in bookSections"
              :key="section.title"
              :label="section.title"
              :value="section.title"
            />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-switch
            v-model="showFavorites"
            active-text="只看收藏"
            @change="handleFavoritesChange"
          />
        </el-col>
      </el-row>
    </el-card>

    <!-- 书籍列表区域 -->
    <div class="books-content">
      <!-- 当前选中分类的标题 -->
      <div class="section-header">
        <h3>{{ currentSection.title }}</h3>
        <p v-if="currentSection.description" class="section-desc">
          {{ currentSection.description }}
        </p>
      </div>

      <!-- 书籍列表 -->
      <div class="book-list">
        <div
          v-for="(book, bookIndex) in currentSection.books"
          :key="bookIndex"
          class="book-item"
        >
          <div class="book-header">
            <div class="book-title">
              <span class="number">{{ bookIndex + 1 }}. </span>
              <a
                v-if="book.doubanUrl"
                :href="book.doubanUrl"
                target="_blank"
                class="name book-link"
              >
                《{{ book.name }}》
              </a>
              <span v-else class="name">《{{ book.name }}》</span>
              <span v-if="book.originalName" class="original-name">
                （{{ book.originalName }}）
              </span>
            </div>
            <el-button
              :type="isBookmarked(book) ? 'danger' : 'default'"
              :icon="isBookmarked(book) ? 'Star' : 'StarFilled'"
              circle
              @click="toggleBookmark(book)"
            />
          </div>
          <div v-if="book.author" class="book-author">
            作者：{{ book.author }}
          </div>
          <div v-if="book.description" class="book-desc">
            {{ book.description }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useLocalStorage } from "@vueuse/core";

interface Book {
  name: string;
  originalName?: string;
  author?: string;
  description?: string;
  doubanUrl?: string;
}

interface BookSection {
  title: string;
  description?: string;
  books: Book[];
}

const bookSections: BookSection[] = [
  {
    title: "华尔街人必读的22本金融佳作",
    books: [
      {
        name: "聪明的投资者",
        originalName: "The Intelligent Investor",
        author: "Benjamin Graham",
        description:
          '格雷厄姆专门为业余投资者所著，巴菲特称之为"有史以来最伟大的投资著作"',
        doubanUrl: "https://book.douban.com/subject/5243775/"
      },
      {
        name: "怎样选择成长股",
        originalName: "Common Stocks and Uncommon Profits",
        author: "Philip Fisher",
        description: '巴菲特称自己的投资策略是"85%的格雷厄姆和15%的费舍尔"',
        doubanUrl: "https://book.douban.com/subject/27202775/"
      },
      {
        name: "投资价值理论",
        originalName: "The Theory of Investment Value",
        author: "John Burr Williams",
        doubanUrl: "https://book.douban.com/subject/3144627/"
      },
      {
        name: "非理性繁荣",
        originalName: "Irrational Exuberance",
        author: "Robert Shiller",
        description:
          "作者罗勃·席勒是2013年诺贝尔经济学奖得主。《纽约客》评论道：本书不仅预言了市场的衰落，更为重要的是，它对于解读投机性泡沫的产生和持续进行了严谨而有益的尝试",
        doubanUrl: "https://book.douban.com/subject/26803982/"
      },
      {
        name: "彼得·林奇的成功投资",
        originalName: "One Up on Wall Street",
        author: "Peter Lynch",
        description:
          "彼得·林奇是全球首屈一指的投资专家，本书总结了股票投资的诸多技巧",
        doubanUrl: "https://book.douban.com/subject/4827219/"
      },
      {
        name: "与天为敌：风险探索传奇",
        originalName: "Against the Gods",
        author: "Peter L. Bernstein",
        doubanUrl: "https://book.douban.com/subject/2151543/"
      },
      {
        name: "股票作手回忆录",
        originalName: "Reminiscences of a Stock Operator",
        author: "Edwin Lefevre",
        doubanUrl: "https://book.douban.com/subject/6974582/"
      },
      {
        name: "证券分析",
        originalName: "Security Analysis",
        author: "Benjamin Graham and David Dodd。",
        description: "格雷厄姆的经典名著，一直被各类投资者奉为价值投资的圣经",
        doubanUrl: "https://book.douban.com/subject/24092345/"
      },
      {
        name: "固定收益证券手册",
        originalName: "The Handbook of Fixed Income Securities",
        author: "Frank J. Fabozzi",
        doubanUrl: "https://book.douban.com/subject/25853509/"
      },
      {
        name: "价值评估",
        originalName: "Damodaran on Valuation",
        author: "Aswath Damodaran",
        doubanUrl: "https://book.douban.com/subject/2015368/"
      },
      {
        name: "共同基金常识",
        originalName: "Common Sense on Mutual Funds",
        author: "John Bogle",
        doubanUrl: "https://book.douban.com/subject/27153416/"
      },
      {
        name: "漫步华尔街",
        originalName: "A Random Walk Down Wall Street",
        author: "Burton Malkiel",
        doubanUrl: "https://book.douban.com/subject/36096815/"
      },
      {
        name: "巴菲特致股东的信：股份公司教程",
        originalName: "The Essays of Warren Buffett",
        author: "巴菲特",
        doubanUrl: "https://book.douban.com/subject/1046164/"
      },
      {
        name: "非同寻常的大众幻想与群众性癫狂",
        originalName:
          "Extraordinary Popular Delusions and the Madness of Crowds",
        author: "Charles Mackay",
        doubanUrl: "https://book.douban.com/subject/1057378/"
      },
      {
        name: "狂热、恐慌与崩溃：金融危机历史",
        originalName: "Manias, Panics, And Crashes",
        author: "Charles P. Kindleberger",
        doubanUrl: "https://book.douban.com/subject/2075831/"
      },
      {
        name: "门口的野蛮人",
        originalName: "Barbarians at the Gate",
        author: "Bryan Burrough and John Helya",
        description:
          "华尔街商战的经典，《华尔街日报》的两位记者以引人入胜的妙笔，曝露出当时华尔街最大的收购——1988年KKR公司收购雷诺兹－纳贝斯克的来龙去脉",
        doubanUrl: "https://book.douban.com/subject/30325661/"
      },
      {
        name: "行为投资学手册",
        originalName: "The Little Book of Behavioural Investing",
        author: "James Montier",
        doubanUrl: "https://book.douban.com/subject/26935601/"
      },
      {
        name: "大而不倒",
        originalName: "Too Big to Fail",
        author: "Andrew Ross Sorkin",
        description:
          "作者是《纽约时报》首席记者及专栏作家，本书通过生动的笔调还原了2008年金融危机时期投行与监管者的众生相",
        doubanUrl: "https://book.douban.com/subject/5297291/"
      },
      {
        name: "拯救华尔街：长期资本管理公司的崛起与陨落",
        originalName:
          "When Genius Failed: The Rise and Fall of Long-term Capital Management",
        author: "Roger Lowenstein",
        description:
          "本书对长期资本管理公司的兴起与衰落做了一次大盘点，叙述充满戏剧性，可读性强，对金融界的解析也非常到位",
        doubanUrl: "https://book.douban.com/subject/3596432/"
      },
      {
        name: "说谎者的扑克牌:华尔街的投资游戏 讲述所罗门兄弟公司的前世和终结",
        originalName: "Liar's Poker",
        author: "Michael Lewis"
      },
      {
        name: "股市长线法宝",
        originalName: "Stocks For The Long Run",
        author: "Jeremy Siegel",
        doubanUrl: "https://book.douban.com/subject/26417291/"
      }
    ]
  },
  {
    title: "金融新手必看的十本书",
    description:
      "全球著名投资管理公司Efficient Frontier Advisors联合创始人William Bernstein推荐",
    books: [
      {
        name: "漫步华尔街",
        originalName: "A Random Walk Down Wall Street",
        author: "Burton Malkiel",
        description:
          "这是一本非常棒的投资初级读本，解释了股票、债券和共同基金的基础知识"
      },
      {
        name: "共同基金常识",
        originalName: "Common Sense on Mutual Funds",
        author: "John Bogle",
        description:
          "这本书提供了关于共同基金的详细介绍，作者是投资巨头Vanguard集团的创始人"
      },
      {
        name: "全球投资",
        originalName: "Global Investing",
        author: "Roger Ibbotson、Gary Brinson",
        description:
          "本书介绍了可投资资产的历史，包括过去200年的美国股市、500年的黄金价格等"
      },
      {
        name: "有效的投资之道",
        originalName: "What Has Worked in Investing",
        author: "Tweedy Browne投资公司",
        description: "这是一个关于价值投资方法的免费小册子，善于用数据支持论据"
      },
      {
        name: "The New Finance, the Case Against Efficient Markets",
        author: "Robert Haugen"
      },
      {
        name: "价值平均法",
        originalName: "originalName",
        author: "Michael Edleson"
      },
      {
        name: "聪明的投资者",
        originalName: "The Intelligent Investor",
        author: "Ben Graham"
      },
      {
        name: "魔鬼来袭",
        originalName: "Devil Take the Hindmost",
        author: "Edward Chancellor"
      },
      {
        name: "邻家的百万富翁",
        originalName: "The Millionaire Next Door",
        author: "Thomas Stanley、William Danko"
      },
      {
        name: "资产配置",
        originalName: "Asset Allocation",
        author: "Roger Gibson"
      }
    ]
  },
  {
    title: "最值得一读的经济史书单",
    books: [
      {
        name: "想象的共同体：民族主义的起与散布",
        originalName: "The Big Short",
        author: "Michael Lewis",
        description: "本书展现了一群洞察次贷危机的'先知者'的故事"
      },
      {
        name: "美国革命的思想意识渊源",
        originalName: "The Ideological Origins of the American Revolution",
        author: "Bernard Bailyn"
      },
      {
        name: "第二性",
        originalName: "The Second Sex",
        author: "Simone de Beauvoir"
      },
      {
        name: "意识形态的终结",
        originalName: "The End of Ideology",
        author: "Daniel Bell"
      },
      {
        name: "重建母职",
        originalName: "The Reproduction of Mothering",
        author: "Nancy Chodorow"
      },
      {
        name: "新阶级",
        originalName: "The New Class",
        author: "Milovan Djilas"
      },
      {
        name: "文化的解释",
        originalName: "The Interpretation of Cultures",
        author: "Clifford Geertz"
      },
      {
        name: "通往奴役之路 知识在社会中的运用",
        originalName: "The Road to Serfdom  The Use of Knowledge in Society",
        author: "Friedrich Hayek"
      },
      {
        name: "退出、呼吁与忠诚",
        originalName: "Exit, Voice, and Loyalty",
        author: "Albert Hirschman"
      },
      {
        name: "科学革命的结构",
        originalName: "The Structure of Scientific Revolutions",
        author: "Thomas Kuhn"
      },
      {
        name: "解除束缚的普罗米修斯",
        originalName: "The Unbound Prometheus",
        author: "David Landes"
      },
      {
        name: "国际经济秩序之演化",
        originalName: "The Evolution of the International Economic Order",
        author: "W. Arthur Lewis"
      },
      {
        name: "瘟疫与人",
        originalName: "Plagues and Peoples》",
        author: "William McNeill"
      },
      {
        name: "民主与专制的社会起源",
        originalName: "Social Origins of Dictatorship and Democracy",
        author: "Barrington Moore"
      },
      {
        name: "向加泰罗尼亚致敬",
        originalName: "Homage to Catalonia",
        author: "George Orwell"
      },
      {
        name: "马基雅维利时刻",
        originalName: "The Machiavellian Moment",
        author: "J.G.A. Pocock"
      },
      {
        name: "大转型",
        originalName: "The Great Transformation",
        author: "Karl Polanyi"
      },
      {
        name: "东方学",
        originalName: "Orientalism",
        author: "Edward Said"
      },
      {
        name: "英国工人阶级的形成",
        originalName: "The Making of the English Working Class",
        author: "E.P. Thompson"
      }
    ]
  },
  {
    title: "读懂金融危机必看的经典书籍",
    books: [
      {
        name: "大空头",
        originalName: "The Big Short",
        author: "Michael Lewis",
        description: "本书展现了一群洞察次贷危机的'先知者'的故事"
      },
      {
        name: "华尔街的终结",
        originalName: "The End of Wall Street",
        author: "Roger Lowenstein",
        description: "记录了2008年金融危机爆发时华尔街'一夜崩塌'的情况"
      },
      {
        name: "太大而不能倒",
        originalName: "Too Big to Fail",
        author: "Andrew Ross Sorkin",
        description:
          "详细记录了2008年金融危机期间华尔街和华盛顿如何拯救金融体系"
      },
      {
        name: "数量分析：数学鬼才如何征服华尔街",
        originalName:
          "The Quants: How a New Breed of Math Whizzes Conquered Wall Street and Nearly Destroyed It",
        author: "Scott Patterson"
      },
      {
        name: "误读市场先生：泡沫那些年",
        originalName: "Mr. Market Miscalculates: The Bubble Years and Beyond",
        author: "George Soros"
      },
      {
        name: "边缘：阻止全球金融系统崩溃的竞赛",
        originalName:
          "On the Brink: Inside the Race to Stop the Collapse of the Global Financial System",
        author: "Henry Paulson."
      },
      {
        name: "抵押贷款崩溃：6个在糟糕时代赚钱的方法",
        originalName:
          "More Mortgage Meltdown: 6 Ways to Profit in These Bad Times",
        author: "Whitney Tilson和Glenn Tongue.",
        description:
          "这本书其实是两本书的结合体，第一部分解释了房地产泡沫出现并破裂的原因，对各种类型的抵押贷款及其给金融系统带来的损失做出了详尽的介绍。第二部分介绍了价值投资，并分析了作者独到的六种不同投资策略。"
      },
      {
        name: "这一次有所不同：8个世纪的金融闹剧",
        originalName:
          "This Time is Different: Eight Centuries of Financial Folly",
        author: "Kenneth S. Rogoff"
      }
    ]
  },

  {
    title: "价值投资者必读书籍",
    books: [
      {
        name: "证券分析",
        originalName: "Security Analysis",
        author: "Benjamin Graham, David Dodd",
        description: "价值投资的圣经，格雷厄姆的经典著作"
      },
      {
        name: "一路骗到底",
        originalName: "Fooling Some of the People All of the Time",
        author: "David Einhorn",
        description: "绿光资本创始人的投资实践"
      },
      {
        name: "股市稳赚",
        originalName: "The Little Book That Beats the Market",
        author: "Joel Greenblatt",
        description: "作者的投资公司在20多年间年均回报率达到了40%"
      }
    ]
  }
];

// 如果需要在组件外部访问这些数据，可以使用 defineExpose
defineExpose({
  bookSections
});

// 搜索和筛选状态
const searchQuery = ref("");
const selectedCategory = ref("华尔街人必读的22本金融佳作");
const showFavorites = ref(false);

// 使用 localStorage 存储收藏的书籍
const bookmarks = useLocalStorage<Book[]>("financial-books-bookmarks", []);

// 判断书籍是否已收藏
const isBookmarked = (book: Book) => {
  return bookmarks.value.some(b => b.name === book.name);
};

// 切换收藏状态
const toggleBookmark = (book: Book) => {
  const index = bookmarks.value.findIndex(b => b.name === book.name);
  if (index === -1) {
    bookmarks.value.push(book);
  } else {
    bookmarks.value.splice(index, 1);
  }
};

// 计算当前应该显示的分类内容
const currentSection = computed(() => {
  if (showFavorites.value) {
    // 如果是收藏模式，返回所有收藏的书籍
    return {
      title: "我的收藏",
      books: bookSections.flatMap(section =>
        section.books.filter(book => isBookmarked(book))
      )
    };
  }

  if (searchQuery.value) {
    // 如果是搜索模式，返回所有匹配的书籍
    const query = searchQuery.value.toLowerCase();
    return {
      title: `搜索结果: "${searchQuery.value}"`,
      books: bookSections.flatMap(section =>
        section.books.filter(
          book =>
            book.name.toLowerCase().includes(query) ||
            book.author?.toLowerCase().includes(query)
        )
      )
    };
  }

  // 正常模式，返回选中的分类
  return (
    bookSections.find(section => section.title === selectedCategory.value) ||
    bookSections[0]
  );
});

// 处理搜索输入
const handleSearch = () => {
  // 搜索逻辑已通过 computed 属性处理
};

// 处理分类变化
const handleCategoryChange = () => {
  // 清除搜索和收藏筛选
  searchQuery.value = "";
  showFavorites.value = false;
};

// 处理收藏过滤
const handleFavoritesChange = () => {
  // 收藏过滤逻辑已通过 computed 属性处理
};

// 添加激活的折叠面板状态
const activeNames = ref([0]); // 默认展开第一个分类
</script>

<style scoped>
.financial-books {
  padding: 20px;
  width: 100%;
  min-height: calc(100vh - 40px);
  box-sizing: border-box;
}

.filter-section {
  margin-bottom: 20px;
  width: 100%;
}

.book-section {
  margin-bottom: 24px;
  width: 100%;
}

.section-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  padding: 10px 0;
}

.section-header h3 {
  margin: 0;
  font-size: 48px;
  color: #303133;
  font-weight: bold;
}

.section-desc {
  margin: 0;
  font-size: 18px;
  color: #666;
  font-weight: normal;
  max-width: 800px;
}

.book-list {
  .book-item {
    padding: 16px 0;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
    }
  }
}

.book-title {
  font-size: 16px;
  margin-bottom: 8px;

  .number {
    color: #909399;
  }

  .name {
    font-weight: 500;
    color: #303133;
  }

  .original-name {
    color: #909399;
    font-size: 20px;
    margin-left: 8px;
  }
}

.book-author {
  font-size: 20px;
  color: #606266;
  margin-bottom: 8px;
}

.book-desc {
  font-size: 20px;
  color: #666;
  line-height: 1.6;
}

.book-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

@media screen and (max-width: 768px) {
  .financial-books {
    padding: 10px;
  }

  .el-row {
    margin: 0 !important;
  }

  .el-col {
    padding: 0 5px;
  }
}

:deep(.el-collapse) {
  border: none;
}

:deep(.el-collapse-item__header) {
  background-color: #f5f7fa;
  padding: 20px;
  justify-content: center;
}

:deep(.el-collapse-item__content) {
  padding: 20px;
}

:deep(.el-collapse-item__arrow) {
  position: absolute;
  right: 20px;
}

.section-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  padding: 10px 0;
}

.section-header h3 {
  margin: 0;
  font-size: 48px;
  color: #303133;
  font-weight: bold;
}

.section-desc {
  margin: 0;
  font-size: 18px;
  color: #666;
  font-weight: normal;
  max-width: 800px;
}

/* 确保折叠面板内容区域的样式正确 */
.book-list {
  background-color: #fff;
}

/* 响应式字体大小设置 */
@media screen and (min-width: 1440px) {
  .book-title {
    font-size: 18px;
  }

  .book-title .original-name {
    font-size: 16px;
  }

  .book-author {
    font-size: 16px;
  }

  .book-desc {
    font-size: 16px;
  }

  :deep(.el-collapse-item__header) {
    font-size: 20px;
  }

  .section-desc {
    font-size: 20px;
  }
}

@media screen and (max-width: 1439px) {
  .book-title {
    font-size: 16px;
  }

  .book-title .original-name {
    font-size: 20px;
  }

  .book-author {
    font-size: 20px;
  }

  .book-desc {
    font-size: 20px;
  }

  :deep(.el-collapse-item__header) {
    font-size: 18px;
  }

  .section-desc {
    font-size: 13px;
  }
}

@media screen and (max-width: 768px) {
  .financial-books {
    padding: 10px;
  }

  .book-title {
    font-size: 15px;
  }

  .book-title .original-name {
    font-size: 13px;
  }

  .book-author {
    font-size: 13px;
  }

  .book-desc {
    font-size: 13px;
  }

  :deep(.el-collapse-item__header) {
    font-size: 16px;
    padding: 10px 15px;
  }

  .section-desc {
    font-size: 12px;
  }

  .el-row {
    margin: 0 !important;
  }

  .el-col {
    padding: 0 5px;
  }

  /* 调整搜索框和选择器在移动端的布局 */
  :deep(.el-select) {
    width: 100%;
  }

  :deep(.el-input) {
    width: 100%;
  }

  .el-col {
    margin-bottom: 10px;
  }
}

@media screen and (max-width: 480px) {
  .book-title {
    font-size: 20px;
  }

  .book-title .original-name {
    font-size: 12px;
  }

  .book-author {
    font-size: 12px;
  }

  .book-desc {
    font-size: 12px;
    line-height: 1.5;
  }

  :deep(.el-collapse-item__header) {
    font-size: 15px;
    padding: 8px 12px;
  }

  :deep(.el-collapse-item__content) {
    padding: 12px;
  }

  .book-item {
    padding: 12px 0;
  }

  .section-desc {
    font-size: 11px;
  }
}

/* 确保内容在大屏幕上不会过于拉伸 */
@media screen and (min-width: 1920px) {
  .financial-books {
    max-width: 1800px;
    margin: 0 auto;
  }

  .book-title {
    font-size: 20px;
  }

  .book-title .original-name {
    font-size: 18px;
  }

  .book-author {
    font-size: 18px;
  }

  .book-desc {
    font-size: 18px;
  }

  :deep(.el-collapse-item__header) {
    font-size: 22px;
  }

  .section-desc {
    font-size: 16px;
  }
}

.books-content {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 20px;
}

/* 添加过渡动画 */
.book-item {
  transition: all 0.3s ease;
}

.book-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 添加链接样式 */
.book-link {
  color: #409eff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.book-link:hover {
  color: #66b1ff;
  text-decoration: underline;
}
</style>
