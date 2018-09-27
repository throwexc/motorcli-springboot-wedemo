package motorcli.example.service.sys.impl;

import motorcli.example.entity.sys.User;
import motorcli.example.mapper.sys.UserMapper;
import motorcli.example.service.sys.LoginLogService;
import com.motorcli.springboot.common.utils.DateUtils;
import motorcli.example.dao.sys.mongodb.LoginLogMongoDBDao;
import motorcli.example.entity.sys.User;
import motorcli.example.entity.sys.mongodb.LoginLog;
import motorcli.example.mapper.sys.UserMapper;
import motorcli.example.service.sys.LoginLogService;
import motorcli.example.entity.sys.User;
import motorcli.example.mapper.sys.UserMapper;
import motorcli.example.service.sys.LoginLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class LoginLogServiceImpl implements LoginLogService {

    @Autowired
    private LoginLogMongoDBDao loginLogMongoDBDao;

    @Autowired
    private UserMapper userMapper;

    @Override
    public LoginLog add(String userId, String ip) {
        Date now = new Date();
        LoginLog log = new LoginLog();
        log.setIp(ip);
        log.setLoginTime(now);
        log.setUserId(userId);

        User user = this.userMapper.queryById(userId);

        String content = "[ " + user.getActor().getName() + " ] 在 " + DateUtils.formatDateTime(now) + " 登录了系统。";

        log.setContent(content);

        return this.loginLogMongoDBDao.save(log);
    }
}
