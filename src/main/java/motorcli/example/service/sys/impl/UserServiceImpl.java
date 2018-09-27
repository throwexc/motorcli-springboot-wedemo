package motorcli.example.service.sys.impl;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import motorcli.example.dto.sys.CheckUserInfo;
import motorcli.example.dto.sys.CheckedRoleModel;
import motorcli.example.dto.sys.UserModel;
import motorcli.example.dto.sys.params.UserSearchParams;
import motorcli.example.dto.sys.params.UserUpdatePasswordParams;
import motorcli.example.entity.sys.*;
import motorcli.example.mapper.sys.*;
import motorcli.example.service.sys.UserService;
import com.motorcli.springboot.common.exceptions.DataConverterException;
import com.motorcli.springboot.common.utils.CollectionUtils;
import com.motorcli.springboot.common.utils.DateUtils;
import lombok.extern.slf4j.Slf4j;
import motorcli.example.dto.sys.CheckUserInfo;
import motorcli.example.dto.sys.CheckedRoleModel;
import motorcli.example.dto.sys.UserModel;
import motorcli.example.dto.sys.params.UserAndRoleRelationSaveParams;
import motorcli.example.dto.sys.params.UserSearchParams;
import motorcli.example.dto.sys.params.UserUpdatePasswordParams;
import motorcli.example.emnus.common.DataState;
import motorcli.example.entity.sys.*;
import motorcli.example.exceptions.BusException;
import motorcli.example.exceptions.DataRepeatException;
import motorcli.example.exceptions.NotAffectedDataException;
import motorcli.example.mapper.sys.*;
import motorcli.example.service.sys.UserService;
import motorcli.example.dto.sys.CheckUserInfo;
import motorcli.example.dto.sys.CheckedRoleModel;
import motorcli.example.dto.sys.UserModel;
import motorcli.example.dto.sys.params.UserSearchParams;
import motorcli.example.dto.sys.params.UserUpdatePasswordParams;
import motorcli.example.entity.sys.*;
import motorcli.example.mapper.sys.*;
import motorcli.example.service.sys.UserService;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.util.*;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    @Value("${user.default.password}")
    private String defaultPassword;

    @Autowired
    private ActorMapper actorMapper;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private RoleMapper roleMapper;

    @Autowired
    private UserAndRoleRelationMapper userAndRoleRelationMapper;

    @Autowired
    private UnitMapper unitMapper;

    @Override
    public CheckUserInfo loginCheck(String username, String password) {
        User user = this.userMapper.queryByUsername(username);

        if (user == null) {
            return new CheckUserInfo(null, "用户名错误", false);
        } else if (user.getDataState() < 0) {
            return new CheckUserInfo(new UserModel(user), "无效的用户", false);
        } else {
            if (!DigestUtils.md5Hex(password).equals(user.getPassword())) {
                return new CheckUserInfo(new UserModel(user), "密码错误", false);
            } else if(user.getActiveTime() != null) {
                Date now = new Date();
                if(user.getActiveTime().compareTo(now) < 0) {
                    return new CheckUserInfo(new UserModel(user), "用户已失效", false);
                } else {
                    return new CheckUserInfo(new UserModel(user), "认证成功", true);
                }
            } else {
                return new CheckUserInfo(new UserModel(user), "认证成功", true);
            }
        }
    }

    @Override
    public List<User> search(UserSearchParams searchParams) {
        searchParams.setOperable(true);
        return this.userMapper.search(searchParams);
    }

    @Override
    public Page<User> searchPage(UserSearchParams searchParams) {
        searchParams.setOperable(true);
        return PageHelper.startPage(searchParams.getPageNum(), searchParams.getPageSize()).doSelectPage(() -> {
            userMapper.search(searchParams);
        });
    }

    @Override
    @Transactional
    public User save(UserModel model) {
        Actor actor;
        User user;
        User usernameCheckUser = this.userMapper.queryByUsername(model.getUsername());

        if(!StringUtils.isEmpty(model.getId())) {
            user = this.userMapper.queryById(model.getId());
            actor = user.getActor();
            if(usernameCheckUser != null && !usernameCheckUser.getId().equals(user.getId())) {
                throw new DataRepeatException("用户名", model.getUsername());
            }
        } else {
            if(usernameCheckUser != null) {
                throw new DataRepeatException("用户名", model.getUsername());
            }

            user = new User();
            actor = new Actor();
            user.setPassword(DigestUtils.md5Hex(this.defaultPassword));
            user.setCreateTime(new Date());
        }

        if(!StringUtils.isEmpty(model.getUnitId())) {
            Unit unit = this.unitMapper.queryById(model.getUnitId());

            if(unit != null) {
                user.setUnitId(model.getUnitId());
                user.setUnit(unit);
            }
        }

        if(!StringUtils.isEmpty(model.getUsername())) {
            user.setUsername(model.getUsername());
        }

        actor.setName(model.getName());
        user.setSex(model.getSex());
        user.setUpdateTime(new Date());

        if(!StringUtils.isEmpty(model.getPhone())) {
            user.setPhone(model.getPhone());
        } else {
            user.setPhone(null);
        }

        if(!StringUtils.isEmpty(model.getEmail())) {
            user.setEmail(model.getEmail());
        } else {
            user.setEmail(null);
        }

        if(!StringUtils.isEmpty(model.getRemark())) {
            actor.setRemark(model.getRemark());
        } else {
            actor.setRemark(null);
        }

        if(!StringUtils.isEmpty(model.getBirthday())){
            try {
                user.setBirthday(DateUtils.parseDate(model.getBirthday()));
            } catch (ParseException e) {
                throw new DataConverterException("生日格式错误");
            }
        } else {
            user.setBirthday(null);
        }

        int actorSaveFlag;
        int userSaveFlag;

        if(StringUtils.isEmpty(user.getId())) {
            String id = UUID.randomUUID().toString();
            actor.setId(id);
            user.setId(id);
            actorSaveFlag = this.actorMapper.insert(actor);
            userSaveFlag = this.userMapper.insert(user);
        } else {
            actorSaveFlag = this.actorMapper.updateByPrimaryKey(actor);
            userSaveFlag = this.userMapper.updateByPrimaryKey(user);
        }

        if(actorSaveFlag <= 0 || userSaveFlag <= 0) {
            throw new NotAffectedDataException();
        }

        user.setActor(actor);

        return user;
    }

    @Override
    public User updateUserBaseInfo(UserModel model) {
        User user = this.userMapper.queryById(model.getId());
        Actor actor = user.getActor();

        actor.setName(model.getName());
        user.setSex(model.getSex());

        if(!StringUtils.isEmpty(model.getPhone())) {
            user.setPhone(model.getPhone());
        } else {
            user.setPhone(null);
        }

        if(!StringUtils.isEmpty(model.getEmail())) {
            user.setEmail(model.getEmail());
        } else {
            user.setEmail(null);
        }

        if(!StringUtils.isEmpty(model.getBirthday())){
            try {
                user.setBirthday(DateUtils.parseDate(model.getBirthday()));
            } catch (ParseException e) {
                throw new DataConverterException("生日格式错误");
            }
        }

        int actorSaveFlag = this.actorMapper.updateByPrimaryKey(actor);
        int userSaveFlag = this.userMapper.updateByPrimaryKey(user);

        if(actorSaveFlag <= 0 || userSaveFlag <= 0) {
            throw new NotAffectedDataException();
        }

        user.setActor(actor);

        return user;
    }

    @Override
    public void deleteById(String id) {
        User user = this.userMapper.queryById(id);
        if(user != null) {
            // 逻辑删除
            user.setDataState(DataState.DELETE.code());
            this.userMapper.updateByPrimaryKey(user);
        }
    }

    @Override
    @Transactional
    public void deleteByIdSet(Set<String> ids) {
        if(!CollectionUtils.isEmpty(ids)) {
            for(String id : ids) {
                this.deleteById(id);
            }
        }
    }

    @Override
    public List<User> queryByState(DataState state) {
        return this.userMapper.queryByState(state.code());
    }

    @Override
    @Transactional
    public List<User> recoveryDeletedUsers(Set<String> ids) {
        List<User> list = new ArrayList<>();
        if(!CollectionUtils.isEmpty(ids)) {
            for(String id : ids) {
                User user = this.userMapper.queryById(id);
                user.setDataState(DataState.ENABLE.code());
                this.userMapper.updateByPrimaryKey(user);
                list.add(user);
            }
        }
        return list;
    }

    @Override
    @Transactional
    public List<User> setUsersPassword(Set<String> ids, String password) {
        List<User> list = new ArrayList<>();
        if(!CollectionUtils.isEmpty(ids)) {
            for(String id : ids) {
                User user = this.userMapper.queryById(id);
                user.setPassword(DigestUtils.md5Hex(password));
                this.userMapper.updateByPrimaryKey(user);
                list.add(user);
            }
        }
        return list;
    }

    @Override
    @Transactional
    public User changePassword(UserUpdatePasswordParams params) {
        User user = this.userMapper.queryById(params.getUserId());
        if (user.getPassword().equals(DigestUtils.md5Hex(params.getOldPassword()))){
            if(!params.getNewPassword().equals(params.getConfirmPassword())) {
                throw new BusException("新密码与确认密码不一致");
            }
            user.setPassword(DigestUtils.md5Hex(params.getNewPassword()));
            this.userMapper.updateByPrimaryKey(user);
        } else {
            throw new BusException("用户密码错误");
        }
        return user;
    }

    @Override
    @Transactional
    public List<User> setUsersUnit(Set<String> ids, String unitId) {
        List<User> list = new ArrayList<>();
        if(!CollectionUtils.isEmpty(ids)) {
            for(String id : ids) {
                User user = this.userMapper.queryById(id);
                user.setUnitId(unitId);
                this.userMapper.updateByPrimaryKey(user);
                list.add(user);
            }
        }
        return list;
    }

    @Override
    public List<CheckedRoleModel> queryCheckedRoleModel(String userId) {
        List<Role> roles = this.roleMapper.queryAll();
        List<Role> userRoles = this.userAndRoleRelationMapper.queryRoleByUserId(userId);

        Map<String, Role> roleMap = new HashMap<>();

        for(Role userRole : userRoles) {
            roleMap.put(userRole.getId(), userRole);
        }

        List<CheckedRoleModel> resultList = new ArrayList<>();

        for(Role role : roles) {
            if(roleMap.get(role.getId()) != null) {
                resultList.add(new CheckedRoleModel(role, true));
            } else {
                resultList.add(new CheckedRoleModel(role, false));
            }
        }
        return resultList;
    }

    @Override
    @Transactional
    public void saveRoleRelations(UserAndRoleRelationSaveParams saveParams) {
        this.userAndRoleRelationMapper.deleteByUserId(saveParams.getUserId());

        for(String roleId : saveParams.getRoleIds()) {
            UserAndRoleRelation relation = new UserAndRoleRelation();
            relation.setRoleId(roleId);
            relation.setUserId(saveParams.getUserId());
            this.userAndRoleRelationMapper.insert(relation);
        }
    }
}
