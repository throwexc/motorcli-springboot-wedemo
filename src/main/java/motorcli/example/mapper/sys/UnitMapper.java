package motorcli.example.mapper.sys;

import motorcli.example.entity.sys.Unit;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;

public interface UnitMapper extends Mapper<Unit> {

    /**
     * 查询部门信息
     * @param id 部门ID
     */
    Unit queryById(String id);

    /**
     * 查询部门信息
     */
    List<Unit> queryAll();

    /**
     * 查询没有删除的部门信息
     */
    List<Unit> queryNotDelete();

    /**
     * 查询没有删除的部门信息
     * @param parentId 父节点ID
     */
    List<Unit> queryNotDeleteByParentId(String parentId);
}
