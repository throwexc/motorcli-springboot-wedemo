package motorcli.example.mapper.sys;

import motorcli.example.entity.sys.Area;
import motorcli.example.entity.sys.Area;
import motorcli.example.entity.sys.Area;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;

public interface AreaMapper extends Mapper<Area> {

    /**
     * 查询区域信息
     * @param id 区域ID
     */
    Area queryById(String id);

    /**
     * 查询顶级节点
     */
    List<Area> queryHasNotParent();

    /**
     * 查询区域信息
     * @param parentId 父节点ID
     */
    List<Area> queryByParentId(String parentId);

    /**
     * 统计区域信息
     * @param parentId 父节点ID
     */
    long countByParentId(String parentId);

    /**
     * 删除区域
     * @param id 区域ID
     */
    int deleteById(String id);
}
