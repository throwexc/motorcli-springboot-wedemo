package motorcli.example.controller.api.sys;

import com.motorcli.springboot.restfull.result.Result;
import com.motorcli.springboot.restfull.result.ResultItems;
import com.motorcli.springboot.restfull.result.ResultRecord;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import motorcli.example.common.base.BaseApi;
import motorcli.example.dto.sys.UnitModel;
import motorcli.example.entity.sys.Unit;
import motorcli.example.service.sys.UnitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 部门API
 */
@RestController
@RequestMapping("/api/sys/unit")
@Api(value = "部门")
public class UnitApi extends BaseApi {

    @Autowired
    private UnitService unitService;

    @RequestMapping(value = "/tree", method = RequestMethod.GET)
    @ApiOperation(value="查询部门")
    public ResultItems<UnitModel> tree() {
        List<Unit> list = this.unitService.queryAll();
        return this.getTreeListResult(list, UnitModel.class);
    }

    @RequestMapping(value = "/save", method = RequestMethod.POST)
    @ApiOperation(value="保存部门")
    public ResultRecord<UnitModel> save(@RequestBody UnitModel unitModel) {
        Unit unit = this.unitService.save(unitModel);
        return this.getResult(new UnitModel(unit));
    }

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
    @ApiOperation(value="删除部门")
    public Result delete(@PathVariable String id) {
        this.unitService.deleteById(id);
        return this.getResult();
    }
}
