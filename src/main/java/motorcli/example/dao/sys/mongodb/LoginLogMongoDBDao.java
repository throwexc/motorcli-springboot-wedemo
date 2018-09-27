package motorcli.example.dao.sys.mongodb;

import motorcli.example.entity.sys.mongodb.LoginLog;
import motorcli.example.entity.sys.mongodb.LoginLog;
import motorcli.example.entity.sys.mongodb.LoginLog;

public interface LoginLogMongoDBDao {

    /**
     * 保存日志
     * @param log 日志对象
     */
    LoginLog save(LoginLog log);
}
