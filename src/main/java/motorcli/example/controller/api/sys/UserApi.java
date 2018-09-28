package motorcli.example.controller.api.sys;

import com.github.pagehelper.Page;
import motorcli.example.dto.sys.CheckedRoleModel;
import motorcli.example.dto.sys.UserModel;
import motorcli.example.dto.sys.params.PasswordSaveParams;
import motorcli.example.dto.sys.params.UserSearchParams;
import motorcli.example.dto.sys.params.UserUpdatePasswordParams;
import motorcli.example.dto.sys.params.UserUpdateUnitParams;
import motorcli.example.entity.sys.User;
import motorcli.example.service.sys.UserService;
import com.motorcli.springboot.common.utils.CollectionUtils;
import com.motorcli.springboot.restful.result.Result;
import com.motorcli.springboot.restful.result.ResultItems;
import com.motorcli.springboot.restful.result.ResultRecord;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import motorcli.example.common.base.BaseApi;
import motorcli.example.dto.sys.CheckedRoleModel;
import motorcli.example.dto.sys.UserModel;
import motorcli.example.dto.sys.params.*;
import motorcli.example.emnus.common.DataState;
import motorcli.example.entity.sys.User;
import motorcli.example.service.sys.UserService;
import motorcli.example.dto.sys.CheckedRoleModel;
import motorcli.example.dto.sys.UserModel;
import motorcli.example.dto.sys.params.PasswordSaveParams;
import motorcli.example.dto.sys.params.UserSearchParams;
import motorcli.example.dto.sys.params.UserUpdatePasswordParams;
import motorcli.example.dto.sys.params.UserUpdateUnitParams;
import motorcli.example.entity.sys.User;
import motorcli.example.service.sys.UserService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 用户API
 */
@RestController
@RequestMapping("/api/sys/user")
@Api(value = "用户")
public class UserApi extends BaseApi {

    @Autowired
    private UserService userService;

    @RequestMapping(value = "/search", method = RequestMethod.GET)
    @ApiOperation(value="查询用户")
    public ResultItems<UserModel> users(HttpServletRequest request) {
        UserSearchParams searchParams = new UserSearchParams(request);

        if(searchParams.getPageNum()!= null && searchParams.getPageSize() != null) {
            Page<User> page = this.userService.searchPage(searchParams);
            return this.getPageResult(page, UserModel.class);
        } else {
            List<User> list = this.userService.search(searchParams);
            return this.getListResult(list, UserModel.class);
        }
    }

    @RequestMapping(value = "/save", method = RequestMethod.POST)
    @ApiOperation(value="保存用户")
    public ResultRecord<UserModel> save(@RequestBody UserModel model) {
        User user = this.userService.save(model);
        return this.getResult(new UserModel(user));
    }

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
    @ApiOperation(value="删除用户")
    public Result delete(@PathVariable String id) {
        this.userService.deleteById(id);
        return this.getResult();
    }

    @RequestMapping(value = "/delete", method = RequestMethod.DELETE)
    @ApiOperation(value="删除用户")
    public Result delete(@RequestBody @ApiParam("id集合") List<String> ids) {
        Set<String> idSet = new HashSet<>();
        idSet.addAll(ids);
        this.userService.deleteByIdSet(idSet);
        return this.getResult();
    }

    @RequestMapping(value = "/status/delete", method = RequestMethod.GET)
    @ApiOperation(value="查询已删除用户")
    public ResultItems<UserModel> queryDeleteUser() {
        List<User> list = this.userService.queryByState(DataState.DELETE);
        return this.getListResult(list, UserModel.class);
    }

    @RequestMapping(value = "/status/delete/recovery", method = RequestMethod.POST)
    @ApiOperation(value="恢复已删除用户")
    public ResultItems<UserModel> recoveryDeletedUsers(@RequestBody @ApiParam("id集合") List<String> ids) {
        Set<String> idSet = CollectionUtils.toSet(ids);
        List<User> list = this.userService.recoveryDeletedUsers(idSet);
        return this.getListResult(list, UserModel.class);
    }

    @RequestMapping(value = "/set/password", method = RequestMethod.POST)
    @ApiOperation(value="设置用户密码")
    public ResultItems<UserModel> setPassword(@RequestBody @ApiParam("保存参数") PasswordSaveParams passwordParams) {
        Set<String> idSet = CollectionUtils.toSet(passwordParams.getUserIds());
        List<User> list = this.userService.setUsersPassword(idSet, passwordParams.getPassword());
        return this.getListResult(list, UserModel.class);
    }

    @RequestMapping(value = "/update/password", method = RequestMethod.POST)
    @ApiOperation(value="用户修改密码")
    public Result updatePassword(@RequestBody @ApiParam("修改密码参数") UserUpdatePasswordParams params) {
        User user = this.userService.changePassword(params);
        return  this.getResult(new UserModel(user));
    }

    @RequestMapping(value = "/set/unit", method = RequestMethod.POST)
    @ApiOperation(value="设置用户部门")
    public ResultItems<UserModel> setUnit(@RequestBody UserUpdateUnitParams unitParams) {
        Set<String> idSet = CollectionUtils.toSet(unitParams.getUserIds());
        List<User> list = this.userService.setUsersUnit(idSet, unitParams.getUnitId());
        return this.getListResult(list, UserModel.class);
    }

    @RequestMapping(value = "/check/roles", method = RequestMethod.GET)
    @ApiOperation(value = "查询用户角色列表", notes = "检查用户是否具有角色， 如果具有则 checked=true")
    public ResultItems<CheckedRoleModel> findRoleToCheckedData(@RequestParam(required = false) @ApiParam("用户ID") String userId, @RequestParam(required = false) @ApiParam("关键字") final String search) {
        if(StringUtils.isEmpty(userId)) {
            return this.getResult(new ArrayList<CheckedRoleModel>());
        }
        List<CheckedRoleModel> list = this.userService.queryCheckedRoleModel(userId);
        if(!StringUtils.isEmpty(search)) {
            list = list.stream().filter(model -> model.getName().indexOf(search) != -1).collect(Collectors.toList());;
        }
        ResultItems<CheckedRoleModel> result = this.getResult(list);
        return result;
    }

    @RequestMapping(value = "/save/role", method = RequestMethod.POST)
    @ApiOperation(value = "保存角色关系")
    public Result saveRoles(@RequestBody @ApiParam("角色关系参数") UserAndRoleRelationSaveParams saveParams) {
        this.userService.saveRoleRelations(saveParams);
        return this.getResult();
    }
}
