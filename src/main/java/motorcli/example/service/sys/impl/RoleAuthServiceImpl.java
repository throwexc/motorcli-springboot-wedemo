package motorcli.example.service.sys.impl;

import com.motorcli.springboot.restful.auth.UserInfo;
import com.motorcli.springboot.restful.auth.UserRole;
import com.motorcli.springboot.restful.auth.service.RoleAuthService;
import motorcli.example.emnus.sys.ACLType;
import motorcli.example.entity.sys.Role;
import motorcli.example.entity.sys.User;
import motorcli.example.mapper.sys.UserAndRoleRelationMapper;
import motorcli.example.mapper.sys.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RoleAuthServiceImpl implements RoleAuthService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private UserAndRoleRelationMapper userAndRoleRelationMapper;

    @Override
    public List<UserRole> findRolesByUser(UserInfo userInfo) {

        User user = this.userMapper.queryByUsername(userInfo.getUsername());

        List<UserRole> resultList = new ArrayList<>();

        if(user.getActor().getAclType() == ACLType.SUPER.code()) {
            resultList.add(new UserRole("admin"));
            return resultList;
        }

        List<Role> roles = this.userAndRoleRelationMapper.queryRoleByUserId(user.getId());

        for(Role role : roles) {
            resultList.add(new UserRole(role.getActor().getName()));
        }

        return resultList;
    }
}
