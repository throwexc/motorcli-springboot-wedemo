package motorcli.example.controller.api.sys;

import com.github.pagehelper.Page;
import motorcli.example.dto.sys.RoleModel;
import motorcli.example.dto.sys.params.RoleSearchParams;
import motorcli.example.entity.sys.Role;
import motorcli.example.service.sys.RoleService;
import com.motorcli.springboot.common.utils.CollectionUtils;
import com.motorcli.springboot.restfull.result.Result;
import com.motorcli.springboot.restfull.result.ResultItems;
import com.motorcli.springboot.restfull.result.ResultRecord;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import motorcli.example.common.base.BaseApi;
import motorcli.example.dto.sys.RoleModel;
import motorcli.example.dto.sys.params.RoleSearchParams;
import motorcli.example.entity.sys.Role;
import motorcli.example.service.sys.RoleService;
import motorcli.example.dto.sys.RoleModel;
import motorcli.example.dto.sys.params.RoleSearchParams;
import motorcli.example.entity.sys.Role;
import motorcli.example.service.sys.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/sys/role")
@Api(value = "角色")
public class RoleApi extends BaseApi {

    @Autowired
    private RoleService roleService;

    @RequestMapping(value = "/search", method = RequestMethod.GET)
    @ApiOperation(value="查询角色")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "name", value = "角色名称", paramType = "query", dataType = "string"),
            @ApiImplicitParam(name = "keywords", value = "关键字", paramType = "query", dataType = "string"),
            @ApiImplicitParam(name = "pageNum", value = "页码", paramType = "query", dataType = "int"),
            @ApiImplicitParam(name = "pageSize", value = "页长", paramType = "query", dataType = "int")
    })
    public ResultItems<RoleModel> search(HttpServletRequest request) {
        RoleSearchParams searchParams = new RoleSearchParams(request);

        if(searchParams.getPageNum() != null && searchParams.getPageSize() != null) {
            Page<Role> pageInfo = this.roleService.searchPage(searchParams);
            return this.getPageResult(pageInfo, RoleModel.class);
        } else {
            List<Role> list = this.roleService.queryAll();
            return this.getListResult(list, RoleModel.class);
        }
    }

    @RequestMapping(value = "/save", method = RequestMethod.POST)
    @ApiOperation(value="保存角色")
    public ResultRecord<RoleModel> save(@RequestBody RoleModel roleModel) {
        Role role = this.roleService.save(roleModel);
        return this.getResult(new RoleModel(role));
    }

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
    @ApiOperation(value="删除角色")
    public Result delete(@PathVariable String id) {
        this.roleService.deleteById(id);
        return this.getResult();
    }

    @RequestMapping(value = "/delete", method = RequestMethod.DELETE)
    @ApiOperation(value="删除角色")
    public Result delete(@RequestBody List<String> ids) {
        if(CollectionUtils.isEmpty(ids)) {
            return this.getResult();
        }
        Set<String> idSet = new HashSet<>();
        idSet.addAll(ids);
        this.roleService.deleteByIdSet(idSet);
        return this.getResult();
    }
}
