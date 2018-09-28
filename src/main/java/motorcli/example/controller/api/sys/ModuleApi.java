package motorcli.example.controller.api.sys;

import motorcli.example.entity.sys.Module;
import com.motorcli.springboot.restful.result.Result;
import com.motorcli.springboot.restful.result.ResultItems;
import com.motorcli.springboot.restful.result.ResultRecord;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import motorcli.example.common.base.BaseApi;
import motorcli.example.dto.sys.ModuleModel;
import motorcli.example.entity.sys.Module;
import motorcli.example.service.sys.ModuleService;
import motorcli.example.entity.sys.Module;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sys/module")
@Api(value = "模块")
public class ModuleApi extends BaseApi {

    @Autowired
    private ModuleService moduleService;

    @RequestMapping(value = "/tree", method = RequestMethod.GET)
    @ApiOperation(value = "查询模块信息", notes = "树形结构数据")
    public ResultItems<ModuleModel> tree() {
        List<Module> list = this.moduleService.queryAll();
        return this.getTreeListResult(list, ModuleModel.class);
    }


    @RequestMapping(value = "/save", method = RequestMethod.POST)
    @ApiOperation(value="保存模块")
    public ResultRecord<ModuleModel> save(@RequestBody ModuleModel moduleDto) {
        Module module = this.moduleService.save(moduleDto);
        return this.getResult(new ModuleModel(module));
    }

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
    @ApiOperation(value="删除模块")
    public Result delete(@PathVariable String id) {
        this.moduleService.deleteById(id);
        return this.getResult();
    }
}
