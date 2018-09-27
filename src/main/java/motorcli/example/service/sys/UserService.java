package motorcli.example.service.sys;

import com.github.pagehelper.Page;
import motorcli.example.dto.sys.CheckUserInfo;
import motorcli.example.dto.sys.CheckedRoleModel;
import motorcli.example.dto.sys.UserModel;
import motorcli.example.dto.sys.params.UserSearchParams;
import motorcli.example.dto.sys.params.UserUpdatePasswordParams;
import motorcli.example.entity.sys.User;
import motorcli.example.dto.sys.CheckUserInfo;
import motorcli.example.dto.sys.CheckedRoleModel;
import motorcli.example.dto.sys.UserModel;
import motorcli.example.dto.sys.params.UserAndRoleRelationSaveParams;
import motorcli.example.dto.sys.params.UserSearchParams;
import motorcli.example.dto.sys.params.UserUpdatePasswordParams;
import motorcli.example.emnus.common.DataState;
import motorcli.example.entity.sys.User;
import motorcli.example.dto.sys.CheckUserInfo;
import motorcli.example.dto.sys.CheckedRoleModel;
import motorcli.example.dto.sys.UserModel;
import motorcli.example.dto.sys.params.UserSearchParams;
import motorcli.example.dto.sys.params.UserUpdatePasswordParams;
import motorcli.example.entity.sys.User;

import java.util.List;
import java.util.Set;

public interface UserService {

    /**
     * 登录检查
     * @param username 用户名
     * @param password 密码
     */
    CheckUserInfo loginCheck(String username, String password);

    /**
     * 查询用户
     * @param searchParams 查询参数
     */
    List<User> search(UserSearchParams searchParams);

    /**
     * 查询用户
     * @param searchParams 查询参数
     */
    Page<User> searchPage(UserSearchParams searchParams);

    /**
     * 保存用户
     * @param model 保存参数
     */
    User save(UserModel model);

    /**
     * 更新用户基础信息
     * @param model 保存参数
     */
    User updateUserBaseInfo(UserModel model);

    /**
     * 删除用户
     * @param id 用户ID
     */
    void deleteById(String id);

    /**
     * 删除用户
     * @param ids id集合
     */
    void deleteByIdSet(Set<String> ids);

    /**
     * 查询用户
     * @param state 状态
     */
    List<User> queryByState(DataState state);

    /**
     * 恢复删除
     * @param ids 用户ID集合
     */
    List<User> recoveryDeletedUsers(Set<String> ids);

    /**
     * 设置用户密码
     * @param ids 用户ID集合
     * @param password 密码
     */
    List<User> setUsersPassword(Set<String> ids, String password);

    /**
     * 用户修改密码
     * @param params 修改密码参数
     */
    User changePassword(UserUpdatePasswordParams params);

    /**
     * 修改用户部门
     * @param ids 用户ID集合
     * @param unitId 部门ID
     */
    List<User> setUsersUnit(Set<String> ids, String unitId);

    /**
     * 查询角色列表
     * 并标记用户具有的角色
     * @param userId 用户ID
     */
    List<CheckedRoleModel> queryCheckedRoleModel(String userId);

    /**
     * 保存用户与角色的关联关系
     * @param saveParams 保存参数
     */
    void saveRoleRelations(UserAndRoleRelationSaveParams saveParams);
}
