package motorcli.example.mapper.sys;

import motorcli.example.entity.sys.Module;
import motorcli.example.entity.sys.Module;
import motorcli.example.entity.sys.Module;
import org.apache.ibatis.annotations.Param;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;
import java.util.Set;

public interface ModuleMapper extends Mapper<Module> {

    Module queryById(String id);

    /**
     * 查询模块
     * @param moduleUrl 模块接口
     */
    Module queryByModuleUrl(String moduleUrl);

    /**
     * 查询模块
     */
    List<Module> queryAll();

    /**
     * 查询模块信息
     * @param parentId 父节点ID
     */
    List<Module> queryByParentId(String parentId);


    /**
     * 查询模块
     * @param status 状态
     * @param ids ID集合
     */
    List<Module> queryByStateAndInIds(@Param("state") int state, @Param("ids") Set<String> ids);
}
