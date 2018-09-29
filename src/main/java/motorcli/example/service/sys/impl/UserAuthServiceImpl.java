package motorcli.example.service.sys.impl;

import com.motorcli.springboot.restful.auth.UserInfo;
import com.motorcli.springboot.restful.auth.service.UserAuthService;
import motorcli.example.entity.sys.User;
import motorcli.example.mapper.sys.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserAuthServiceImpl implements UserAuthService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public UserInfo findByUsername(String username) {
        User user = userMapper.queryByUsername(username);
        return new UserInfo(user.getUsername(), user.getPassword());
    }
}
