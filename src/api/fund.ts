import { http } from "@/utils/http";

// API配置
const FUND_API_CONFIG = {
  baseURL: "https://fund.market.alicloudapi.com",
  headers: {
    Authorization: "APPCODE your_app_code_here" // 替换为你的APPCODE
  }
};

// 获取基金排名
export const getFundRanking = async (
  fundcode: string
): Promise<FundRankingResponse> => {
  const response = await http.get<any, { data: FundRankingResponse }>(
    "/fundRank",
    {
      baseURL: FUND_API_CONFIG.baseURL,
      headers: FUND_API_CONFIG.headers,
      params: { fundcode }
    }
  );
  return response.data;
};

// API响应类型
export interface FundRankingResponse {
  code: string;
  msg: string;
  data: {
    fundcode: string;
    name: string;
    type: string;
    nav: number;
    navDate: string;
    dayGrowth: string;
    weekGrowth: string;
    monthGrowth: string;
    yearGrowth: string;
    ranking: number;
  }[];
}

// 基金信息接口
export interface FundInfo {
  code: string; // 基金代码
  name: string; // 基金名称
  type: string; // 基金类型
  nav: number; // 净值
  dateNav: string; // 净值日期
  gsz: string; // 估值
  gszzl: string; // 涨跌幅
  gztime: string; // 估值时间
}

// API返回数据接口
export interface FundApiResponse {
  fundcode?: string;
  code?: string;
  name: string;
  dwjz?: string;
  nav?: number;
  jzrq?: string;
  dateNav?: string;
  gsz: string;
  gszzl: string;
  gztime: string;
}

// 添加基金排行接口
export interface FundRanking {
  code: string;
  name: string;
  type: string;
  nav: number;
  dateNav: string;
  gsz: number;
  gszzl: number;
  gztime: string;
  dayGrowth: number;
  weekGrowth: number;
  monthGrowth: number;
  yearGrowth: number;
}
