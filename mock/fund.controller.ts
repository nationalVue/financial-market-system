export default [
  {
    url: "/api/fund/rankings",
    method: "get",
    response: () => {
      const mockRankingsData = [
        {
          symbol: "019569",
          name: "明亚久盈90天持有期债券C",
          type: "债券型",
          per_nav: "2.3137",
          total_nav: "2.6343",
          three_month: -0.653336,
          six_month: 0.631287,
          one_year: 163.352,
          form_year: 259.384,
          form_start: 163.352
        },
        {
          symbol: "019568",
          name: "明亚久盈90天持有期债券A",
          type: "债券型",
          per_nav: "2.2671",
          total_nav: "2.586",
          three_month: -0.612172,
          six_month: 0.706611,
          one_year: 158.508,
          form_year: 254.538,
          form_start: 158.534
        },
        {
          symbol: "008728",
          name: "同泰恒利纯债A",
          type: "债券型",
          per_nav: "1.3735",
          total_nav: "2.3525",
          three_month: 0.242345,
          six_month: 1.62342,
          one_year: 77.3691,
          form_year: 176.6927,
          form_start: 145.21
        },
        {
          symbol: "008729",
          name: "同泰恒利纯债C",
          type: "债券型",
          per_nav: "1.3837",
          total_nav: "2.3667",
          three_month: 0.200044,
          six_month: 1.5169,
          one_year: 77.0132,
          form_year: 176.3825,
          form_start: 146.659
        },
        {
          symbol: "513090",
          name: "易方达中证香港证券投资主题ETF",
          type: "ETF",
          per_nav: "1.697",
          total_nav: "1.697",
          three_month: 87.2655,
          six_month: 81.3616,
          one_year: 53.7974,
          form_year: 164.6933,
          form_start: 69.6491
        },
        {
          symbol: "006718",
          name: "国融融盛龙头严选混合A",
          type: "混合型",
          per_nav: "2.0221",
          total_nav: "2.0721",
          three_month: 58.0259,
          six_month: 50.3979,
          one_year: 68.6067,
          form_year: 163.8256,
          form_start: 110.787
        },
        {
          symbol: "006719",
          name: "国融融盛龙头严选混合C",
          type: "混合型",
          per_nav: "2.0753",
          total_nav: "2.1253",
          three_month: 57.9496,
          six_month: 50.2534,
          one_year: 68.2585,
          form_year: 163.5382,
          form_start: 116.023
        },
        {
          symbol: "671010",
          name: "西部利得策略优选混合A",
          type: "混合型",
          per_nav: "1.413",
          total_nav: "1.413",
          three_month: 40.3178,
          six_month: 32.8008,
          one_year: 42.8716,
          form_year: 162.2273,
          form_start: 41.3
        },
        {
          symbol: "017102",
          name: "大摩数字经济混合A",
          type: "混合型",
          per_nav: "1.3129",
          total_nav: "1.3129",
          three_month: 35.6722,
          six_month: 32.4823,
          one_year: 63.5401,
          form_year: 161.5877,
          form_start: 31.29
        },
        {
          symbol: "011060",
          name: "西部利得策略优选混合C",
          type: "混合型",
          per_nav: "1.383",
          total_nav: "1.383",
          three_month: 40.1216,
          six_month: 32.4713,
          one_year: 42.1377,
          form_year: 161.3769,
          form_start: 12.1655
        },
        {
          symbol: "015096",
          name: "东财数字经济混合发起式A",
          type: "混合型",
          per_nav: "1.2181",
          total_nav: "1.2181",
          three_month: 43.4071,
          six_month: 30.3059,
          one_year: 57.9282,
          form_year: 161.2523,
          form_start: 21.81
        },
        {
          symbol: "017103",
          name: "大摩数字经济混合C",
          type: "混合型",
          per_nav: "1.2997",
          total_nav: "1.2997",
          three_month: 35.456,
          six_month: 32.0699,
          one_year: 62.5844,
          form_year: 160.7744,
          form_start: 29.97
        },
        {
          symbol: "015097",
          name: "东财数字经济混合发起式C",
          type: "混合型",
          per_nav: "1.1927",
          total_nav: "1.1927",
          three_month: 43.1813,
          six_month: 29.8389,
          one_year: 56.728,
          form_year: 160.2445,
          form_start: 19.27
        },
        {
          symbol: "673071",
          name: "西部利得新动力混合A",
          type: "混合型",
          per_nav: "2.2898",
          total_nav: "2.5028",
          three_month: 35.1712,
          six_month: 30.3912,
          one_year: 40.9715,
          form_year: 155.8217,
          form_start: 177.753
        },
        {
          symbol: "673073",
          name: "西部利得新动力混合C",
          type: "混合型",
          per_nav: "2.2453",
          total_nav: "2.2453",
          three_month: 35.0881,
          six_month: 30.2454,
          one_year: 40.6741,
          form_year: 155.5456,
          form_start: 124.53
        },
        {
          symbol: "008308",
          name: "华夏见龙精选混合",
          type: "混合型",
          per_nav: "1.5809",
          total_nav: "1.5809",
          three_month: 64.0789,
          six_month: 48.9448,
          one_year: 49.9905,
          form_year: 154.9446,
          form_start: 58.09
        },
        {
          symbol: "167301",
          name: "方正富邦中证保险A",
          type: "指数型",
          per_nav: "1.102",
          total_nav: "1.839",
          three_month: 40.5612,
          six_month: 42.1935,
          one_year: 44.2408,
          form_year: 154.7753,
          form_start: 84.6301
        },
        {
          symbol: "018099",
          name: "方正富邦中证保险C",
          type: "指数型",
          per_nav: "1.097",
          total_nav: "1.097",
          three_month: 40.641,
          six_month: 42.0984,
          one_year: 43.7746,
          form_year: 154.507,
          form_start: 47.0509
        },
        {
          symbol: "512070",
          name: "易方达沪深300非银ETF",
          type: "ETF",
          per_nav: "0.9142",
          total_nav: "2.7426",
          three_month: 59.435,
          six_month: 55.4762,
          one_year: 40.6029,
          form_year: 153.6471,
          form_start: 174.272
        },
        {
          symbol: "019993",
          name: "创金合信北证50成份指数增强A",
          type: "指数型",
          per_nav: "1.5281",
          total_nav: "1.5281",
          three_month: 91.6353,
          six_month: 67.0602,
          one_year: "--",
          form_year: 152.81,
          form_start: 52.81
        },
        {
          symbol: "013490",
          name: "同泰金融精选股票A",
          type: "股票型",
          per_nav: "1.131",
          total_nav: "1.131",
          three_month: 40.3748,
          six_month: 43.5461,
          one_year: 46.6926,
          form_year: 152.4875,
          form_start: 13.1
        },
        {
          symbol: "019994",
          name: "创金合信北证50成份指数增强C",
          type: "指数型",
          per_nav: "1.5243",
          total_nav: "1.5243",
          three_month: 91.495,
          six_month: 66.8089,
          one_year: "--",
          form_year: 152.43,
          form_start: 52.43
        },
        {
          symbol: "018956",
          name: "中航机遇领航混合发起A",
          type: "混合型",
          per_nav: "1.4228",
          total_nav: "1.4228",
          three_month: 47.3183,
          six_month: 31.182,
          one_year: 55.7356,
          form_year: 152.3667,
          form_start: 42.28
        },
        {
          symbol: "013491",
          name: "同泰金融精选股票C",
          type: "股票型",
          per_nav: "1.1174",
          total_nav: "1.1174",
          three_month: 40.2183,
          six_month: 43.238,
          one_year: 46.0845,
          form_year: 151.9445,
          form_start: 11.74
        },
        {
          symbol: "018957",
          name: "中航机遇领航混合发起C",
          type: "混合型",
          per_nav: "1.4118",
          total_nav: "1.4118",
          three_month: 47.0931,
          six_month: 30.7707,
          one_year: 54.8026,
          form_year: 151.5783,
          form_start: 41.18
        },
        {
          symbol: "000950",
          name: "易方达沪深300非银联接A",
          type: "指数型",
          per_nav: "1.2247",
          total_nav: "1.2247",
          three_month: 56.7917,
          six_month: 53.1449,
          one_year: 39.2971,
          form_year: 151.5155,
          form_start: 22.47
        },
        {
          symbol: "519196",
          name: "万家新兴蓝筹",
          type: "混合型",
          per_nav: "3.0015",
          total_nav: "3.4952",
          three_month: 36.9735,
          six_month: 31.5294,
          one_year: 47.6172,
          form_year: 151.4227,
          form_start: 345.22
        },
        {
          symbol: "007882",
          name: "易方达沪深300非银联接C",
          type: "指数型",
          per_nav: "1.2181",
          total_nav: "1.2181",
          three_month: 56.7495,
          six_month: 53.0661,
          one_year: 39.1478,
          form_year: 151.392,
          form_start: 20.7474
        },
        {
          symbol: "001706",
          name: "诺安积极回报混合A",
          type: "混合型",
          per_nav: "2.472",
          total_nav: "2.472",
          three_month: 50.4565,
          six_month: 26.5745,
          one_year: 49.7274,
          form_year: 151.1927,
          form_start: 147.2
        },
        {
          symbol: "005894",
          name: "华夏优势精选股票",
          type: "股票型",
          per_nav: "1.4452",
          total_nav: "1.4452",
          three_month: 62.0543,
          six_month: 45.7884,
          one_year: 45.217,
          form_year: 151.1874,
          form_start: 44.52
        },
        {
          symbol: "005094",
          name: "万家甄选混合",
          type: "混合型",
          per_nav: "3.2313",
          total_nav: "3.2313",
          three_month: 39.1362,
          six_month: 32.0191,
          one_year: 45.5606,
          form_year: 151.0165,
          form_start: 223.13
        },
        {
          symbol: "014279",
          name: "汇添富北交易所创新精选两年定开混合A",
          type: "混合型",
          per_nav: "1.3855",
          total_nav: "1.3855",
          three_month: 94.7568,
          six_month: 74.8486,
          one_year: 96.4412,
          form_year: 150.8109,
          form_start: 38.55
        },
        {
          symbol: "012847",
          name: "诺安积极回报混合C",
          type: "混合型",
          per_nav: "2.612",
          total_nav: "2.612",
          three_month: 50.2877,
          six_month: 26.3667,
          one_year: 49.0868,
          form_year: 150.6344,
          form_start: 24.6778
        },
        {
          symbol: "014280",
          name: "汇添富北交易所创新精选两年定开混合C",
          type: "混合型",
          per_nav: "1.3692",
          total_nav: "1.3692",
          three_month: 94.5715,
          six_month: 74.5093,
          one_year: 95.6559,
          form_year: 150.2964,
          form_start: 36.92
        },
        {
          symbol: "161912",
          name: "万家社会责任A",
          type: "混合型",
          per_nav: "2.4731",
          total_nav: "3.0571",
          three_month: 37.8847,
          six_month: 31.3174,
          one_year: 43.5166,
          form_year: 150.0714,
          form_start: 249.78
        },
        {
          symbol: "009199",
          name: "万家价值优势一年持有期混合",
          type: "混合型",
          per_nav: "1.7875",
          total_nav: "1.7875",
          three_month: 41.137,
          six_month: 34.2269,
          one_year: 42.4189,
          form_year: 149.9958,
          form_start: 78.75
        },
        {
          symbol: "000354",
          name: "长盛城镇化主题混合A",
          type: "混合型",
          per_nav: "1.5818",
          total_nav: "2.2298",
          three_month: 58.1484,
          six_month: 42.9811,
          one_year: 37.6675,
          form_year: 149.5651,
          form_start: 141.186
        },
        {
          symbol: "161913",
          name: "万家社会责任C",
          type: "混合型",
          per_nav: "2.4075",
          total_nav: "2.985",
          three_month: 37.7052,
          six_month: 30.9919,
          one_year: 42.8021,
          form_year: 149.4278,
          form_start: 240.088
        },
        {
          symbol: "012362",
          name: "国泰中证全指证券公司ETF联接A",
          type: "ETF联接",
          per_nav: "1.25",
          total_nav: "1.25",
          three_month: 63.5483,
          six_month: 54.9331,
          one_year: 38.5042,
          form_year: 149.0224,
          form_start: 25
        }
      ];
      return {
        code: 200,
        data: mockRankingsData,
        message: "获取基金排行榜数据成功"
      };
    }
  }
];
