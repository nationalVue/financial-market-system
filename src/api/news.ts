import { http } from "@/utils/http";
import { XMLParser } from "fast-xml-parser";

export interface ArxivArticle {
  id: string;
  title: string;
  summary: string;
  published: string;
  authors: Array<{
    name: string;
  }>;
  categories: string[];
  links: Array<{
    href: string;
    rel: string;
    type?: string;
  }>;
}

export interface ArxivSearchResponse {
  feed: {
    entry: ArxivArticle[];
    totalResults: number;
    startIndex: number;
    itemsPerPage: number;
  };
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  textNodeName: "value",
  isArray: name => ["entry", "author", "link", "category"].indexOf(name) !== -1
});

export function searchArxivArticles(params: {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}) {
  const { page = 0, pageSize = 10, searchQuery = "cat:q-fin" } = params;
  const startIndex = page * pageSize;

  return http
    .get<string, any>(
      "/arxiv/api/query",
      {
        params: {
          search_query: searchQuery,
          start: startIndex,
          max_results: pageSize,
          sortBy: "submittedDate",
          sortOrder: "descending"
        },
        headers: {
          Accept: "application/xml"
        }
      },
      {
        timeout: 30000
      }
    )
    .then(xmlData => {
      const jsonData = parser.parse(xmlData);
      console.log("解析后的原始数据:", jsonData);

      if (!jsonData?.feed?.entry) {
        return {
          feed: {
            entry: [],
            totalResults: 0,
            startIndex: 0,
            itemsPerPage: pageSize
          }
        };
      }

      const entries = Array.isArray(jsonData.feed.entry)
        ? jsonData.feed.entry
        : [jsonData.feed.entry];

      return {
        feed: {
          entry: entries
            .map(entry => {
              if (!entry) return null;

              try {
                return {
                  id: entry.id || "",
                  title: entry.title?.value || "",
                  summary: entry.summary?.value || "",
                  published: entry.published || "",
                  authors: Array.isArray(entry.author)
                    ? entry.author.map(a => ({ name: a?.name || "未知作者" }))
                    : [{ name: "未知作者" }],
                  categories: Array.isArray(entry.category)
                    ? entry.category.map(c => c?.term || "未分类")
                    : ["未分类"],
                  links: Array.isArray(entry.link)
                    ? entry.link.map(l => ({
                        href: l?.href || "",
                        rel: l?.rel || "",
                        type: l?.type || ""
                      }))
                    : []
                };
              } catch (error) {
                console.error("条目解析错误:", error, entry);
                return null;
              }
            })
            .filter(entry => entry !== null) as ArxivArticle[],
          totalResults: parseInt(jsonData.feed["opensearch:totalResults"]) || 0,
          startIndex: parseInt(jsonData.feed["opensearch:startIndex"]) || 0,
          itemsPerPage:
            parseInt(jsonData.feed["opensearch:itemsPerPage"]) || pageSize
        }
      } as ArxivSearchResponse;
    })
    .catch(error => {
      console.error("API 请求或解析错误:", error);
      throw error;
    });
}
