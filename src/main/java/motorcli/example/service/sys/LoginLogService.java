package motorcli.example.service.sys;

import motorcli.example.entity.sys.mongodb.LoginLog;

public interface LoginLogService {

    /**
     * 添加登录日志
     * @param userId 用户ID
     * @param ip IP地址
     * @return 添加的登录日志对象
     */
    LoginLog add(String userId, String ip);
}
