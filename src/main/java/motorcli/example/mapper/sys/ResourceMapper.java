package motorcli.example.mapper.sys;

import motorcli.example.entity.sys.Resource;
import motorcli.example.entity.sys.Resource;
import motorcli.example.entity.sys.Resource;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;

public interface ResourceMapper extends Mapper<Resource> {

    /**
     * 查询系统资源
     * @param id 资源ID
     */
    Resource queryById(String id);

    /**
     * 查询系统资源
     */
    List<Resource> queryAll();
}
