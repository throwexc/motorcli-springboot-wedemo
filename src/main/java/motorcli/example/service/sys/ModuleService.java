package motorcli.example.service.sys;

import motorcli.example.dto.sys.ModuleModel;
import motorcli.example.entity.sys.Module;
import motorcli.example.dto.sys.ModuleModel;
import motorcli.example.entity.sys.Module;
import motorcli.example.dto.sys.ModuleModel;
import motorcli.example.entity.sys.Module;

import java.util.List;

public interface ModuleService {

    /**
     * 保存模块信息
     * @param model 模块数据模型
     */
    Module save(ModuleModel model);

    /**
     * 删除模块数据
     */
    void deleteById(String id);

    /**
     * 查询模块
     */
    List<Module> queryAll();

    /**
     * 查询用户系统模块信息
     * @param userId 用户ID
     */
    List<Module> queryUserSysModule(String userId);
}
