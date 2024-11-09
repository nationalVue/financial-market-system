// 根据角色动态生成路由
import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([
  {
    url: "/login",
    method: "post",
    response: ({ body }) => {
      // 模拟用户数据库
      const users = {
        admin: {
          password: "admin123",
          avatar:
            "https://tse2-mm.cn.bing.net/th/id/OIP-C.xEh4We4bTOQWnfDpbi04DQHaHR?rs=1&pid=ImgDetMain",
          nickname: "管理员",
          roles: ["admin"],
          permissions: ["*:*:*"]
        },
        test: {
          password: "test123",
          avatar:
            "https://tse1-mm.cn.bing.net/th/id/OIP-C.FSp55L8FgQgMAV_Y0C97dwHaHa?rs=1&pid=ImgDetMain",
          nickname: "测试用户",
          roles: ["common"],
          permissions: ["permission:btn:add", "permission:btn:edit"]
        }
      };

      const user = users[body.username];

      if (!user) {
        return {
          success: false,
          message: "用户不存在"
        };
      }

      if (user.password !== body.password) {
        return {
          success: false,
          message: "密码错误"
        };
      }

      return {
        success: true,
        data: {
          username: body.username,
          avatar: user.avatar,
          nickname: user.nickname,
          roles: user.roles,
          permissions: user.permissions,
          accessToken: `eyJhbGciOiJIUzUxMiJ9.${body.username}`,
          refreshToken: `eyJhbGciOiJIUzUxMiJ9.${body.username}Refresh`,
          expires: "2030/10/30 00:00:00"
        }
      };
    }
  }
]);
