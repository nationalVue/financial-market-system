export interface StockData {
  zqdm: string; // 证券代码
  zqjc: string; // 证券简称
  sgdm: string; // 申购代码
  fxsl: number; // 发行数量
  hysyl: number; // 行业市盈率
  zyyw: string; // 主营业务
  [key: string]: any;
}
