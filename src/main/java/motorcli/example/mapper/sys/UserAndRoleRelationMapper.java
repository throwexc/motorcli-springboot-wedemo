package motorcli.example.mapper.sys;

import motorcli.example.entity.sys.Role;
import motorcli.example.entity.sys.User;
import motorcli.example.entity.sys.UserAndRoleRelation;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;

public interface UserAndRoleRelationMapper extends Mapper<UserAndRoleRelation> {

    /**
     * 查询用户角色关联
     * @param userId 用户ID
     * @param roleId 角色ID
     */
    UserAndRoleRelation queryByUserIdAndRoleId(String userId, String roleId);

    /**
     * 查询用户角色
     * @param userId 用户ID
     */
    List<Role> queryRoleByUserId(String userId);

    /**
     * 查询具有角色的用户
     * @param roleId 角色ID
     */
    List<User> queryUserByRoleId(String roleId);

    /**
     * 删除用户与角色关联关系
     * @param roleId 角色ID
     */
    int deleteByRoleId(String roleId);

    /**
     * 删除用户与角色关联关系
     * @param userId 用户ID
     */
    int deleteByUserId(String userId);
}
