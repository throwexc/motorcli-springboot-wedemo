package motorcli.example.service.sys;

import motorcli.example.dto.sys.UnitModel;
import motorcli.example.entity.sys.Unit;
import motorcli.example.dto.sys.UnitModel;
import motorcli.example.entity.sys.Unit;
import motorcli.example.dto.sys.UnitModel;
import motorcli.example.entity.sys.Unit;

import java.util.List;

public interface UnitService {

    /**
     * 查询部门信息
     */
    List<Unit> queryAll();

    /**
     * 保存部门信息
     * @param model 保存参数
     */
    Unit save(UnitModel model);

    /**
     * 删除部门信息
     * @param id 部门ID
     */
    void deleteById(String id);
}
