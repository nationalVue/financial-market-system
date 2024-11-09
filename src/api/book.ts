import { http } from "@/utils/http";

export interface GutendexResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    id: number;
    title: string;
    authors: Array<{
      name: string;
      birth_year: number | null;
      death_year: number | null;
    }>;
    translators: Array<{
      name: string;
      birth_year: number | null;
      death_year: number | null;
    }>;
    subjects: string[];
    bookshelves: string[];
    languages: string[];
    copyright: boolean;
    media_type: string;
    formats: {
      "text/html"?: string;
      "application/epub+zip"?: string;
      "application/x-mobipocket-ebook"?: string;
      "text/plain"?: string;
      "application/rdf+xml"?: string;
      "image/jpeg"?: string;
      "text/plain; charset=us-ascii"?: string;
    };
    download_count: number;
  }>;
}

export interface BookParams {
  search?: string;
  languages?: string;
  page?: number;
  topic?: string;
}

// 金融相关书籍的 ID 列表
const FINANCE_BOOK_IDS = [
  69233, // "The Art of Money Getting" by P. T. Barnum
  45608, // "Capital" by Karl Marx
  37156, // "The Theory of the Leisure Class" by Thorstein Veblen
  30142, // "The Wealth of Nations" by Adam Smith
  66598 // "An Inquiry into the Nature and Causes of the Wealth of Nations" by Adam Smith
];

// 添加响应包装类型
interface ApiResponse<T> {
  data?: T;
  [key: string]: any;
}

// 获取书籍列表
export const getBooks = async (_params?: BookParams) => {
  try {
    const response = await http.get<GutendexResponse, BookParams>(
      "/gutendex/books/",
      {
        params: {
          ids: FINANCE_BOOK_IDS.join(",")
        },
        timeout: 30000,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );

    // 修改响应数据验证逻辑
    if (response && typeof response === "object") {
      // 如果响应是直接的数据对象
      if ("results" in response) {
        return response as GutendexResponse;
      }

      // 如果响应被包装在 data 属性中
      const apiResponse = response as ApiResponse<GutendexResponse>;
      if (apiResponse.data && "results" in apiResponse.data) {
        return apiResponse.data;
      }
    }

    // 如果数据格式不符合预期，返回空结果
    console.warn("Unexpected response format:", response);
    return {
      count: 0,
      next: null,
      previous: null,
      results: []
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      count: 0,
      next: null,
      previous: null,
      results: []
    };
  }
};

// 获取单本书籍详情
export const getBookById = async (id: number) => {
  try {
    const response = await http.get<GutendexResponse["results"][0], null>(
      `/gutendex/books/${id}/`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );

    if (response && typeof response === "object") {
      return response;
    }
    return null;
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
};
