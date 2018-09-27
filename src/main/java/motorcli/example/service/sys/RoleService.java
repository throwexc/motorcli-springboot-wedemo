package motorcli.example.service.sys;

import com.github.pagehelper.Page;
import motorcli.example.dto.sys.RoleModel;
import motorcli.example.dto.sys.params.RoleSearchParams;
import motorcli.example.entity.sys.Role;
import motorcli.example.dto.sys.RoleModel;
import motorcli.example.dto.sys.params.RoleSearchParams;
import motorcli.example.entity.sys.Role;
import motorcli.example.dto.sys.RoleModel;
import motorcli.example.dto.sys.params.RoleSearchParams;
import motorcli.example.entity.sys.Role;

import java.util.List;
import java.util.Set;

public interface RoleService {

    /**
     * 查询角色
     */
    List<Role> queryAll();

    /**
     * 查询角色
     * @param searchParams 查询参数
     */
    List<Role> search(RoleSearchParams searchParams);

    /**
     * 分页查询角色
     * @param searchParams 查询参数
     */
    Page<Role> searchPage(RoleSearchParams searchParams);


    /**
     * 保存角色
     * @param model 保存参数
     */
    Role save(RoleModel model);

    /**
     * 通过ID删除角色
     */
    void deleteById(String id);

    /**
     * 根据ID集合， 删除角色
     * @param idSet ID集合
     */
    void deleteByIdSet(Set<String> idSet);
}
