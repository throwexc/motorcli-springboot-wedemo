package motorcli.example.mapper.sys;

import motorcli.example.entity.sys.Role;
import motorcli.example.dto.sys.params.RoleSearchParams;
import motorcli.example.entity.sys.Role;
import motorcli.example.entity.sys.Role;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;

public interface RoleMapper extends Mapper<Role> {

    Role queryById(String id);

    /**
     * 查询角色
     */
    List<Role> queryAll();

    /**
     * 查询角色
     * @param searchParams 查询参数
     */
    List<Role> search(RoleSearchParams searchParams);
}
