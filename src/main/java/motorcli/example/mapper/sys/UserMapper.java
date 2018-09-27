package motorcli.example.mapper.sys;

import motorcli.example.dto.sys.params.UserSearchParams;
import motorcli.example.entity.sys.User;
import motorcli.example.dto.sys.params.UserSearchParams;
import motorcli.example.entity.sys.User;
import motorcli.example.dto.sys.params.UserSearchParams;
import motorcli.example.entity.sys.User;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;

public interface UserMapper extends Mapper<User> {

    /**
     * 查询用户
     * @param id 用户ID
     */
    User queryById(String id);

    /**
     * 查询用户
     * @param username 用户名
     */
    User queryByUsername(String username);

    /**
     * 组合查询用户
     * @param userSearchParams 查询参数
     */
    List<User> search(UserSearchParams userSearchParams);

    /**
     * 查询用户
     * @param state 用户状态
     */
    List<User> queryByState(int state);
}
