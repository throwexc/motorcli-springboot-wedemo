package motorcli.example.dao.sys.mongodb.impl;

import motorcli.example.dao.sys.mongodb.LoginLogMongoDBDao;
import motorcli.example.entity.sys.mongodb.LoginLog;
import motorcli.example.dao.sys.mongodb.LoginLogMongoDBDao;
import motorcli.example.entity.sys.mongodb.LoginLog;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public class LoginLogMongoDBDaoImpl implements LoginLogMongoDBDao {

    @Autowired
    private MongoTemplate mongoTemplate;

    private final String collectionName = "LoginLog";

    @Override
    public LoginLog save(LoginLog log) {
        if(StringUtils.isEmpty(log.getId())) {
            log.setId(UUID.randomUUID().toString());
        }
        this.mongoTemplate.save(log, this.collectionName);
        return log;
    }
}
