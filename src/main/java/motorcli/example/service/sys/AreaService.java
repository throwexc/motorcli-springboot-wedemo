package motorcli.example.service.sys;

import motorcli.example.dto.sys.AreaModel;
import motorcli.example.entity.sys.Area;
import motorcli.example.dto.sys.AreaModel;
import motorcli.example.entity.sys.Area;
import motorcli.example.dto.sys.AreaModel;
import motorcli.example.entity.sys.Area;

import java.util.List;

public interface AreaService {

    /**
     * 查询区域
     * @param parentId 父节点ID
     */
    List<AreaModel> queryByParentId(String parentId);

    /**
     * 保存区域信息
     * @param model 保存参数
     */
    Area save(AreaModel model);

    /**
     * 删除区域
     * @param id 区域ID
     */
    void deleteById(String id);

    /**
     * 查询区域信息
     * @param topId 顶级节点ID
     */
    List<Area> queryAllByTopId(String topId);
}
