package motorcli.example.controller.api.sys;

import motorcli.example.dto.sys.params.ACLSaveParams;
import motorcli.example.entity.sys.ACL;
import motorcli.example.service.sys.ACLService;
import com.motorcli.springboot.restful.result.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import motorcli.example.common.base.BaseApi;
import motorcli.example.dto.sys.params.ACLSaveParams;
import motorcli.example.entity.sys.ACL;
import motorcli.example.service.sys.ACLService;
import motorcli.example.dto.sys.params.ACLSaveParams;
import motorcli.example.entity.sys.ACL;
import motorcli.example.service.sys.ACLService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sys/acl")
@Api(value = "系统扮演者")
public class ACLApi extends BaseApi {

    @Autowired
    private ACLService aclService;

    @RequestMapping(value = "/save/read", method = RequestMethod.POST)
    @ApiOperation(value = "保存读取权限")
    public Result saveReadACL(@RequestBody @ApiParam("权限参数") ACLSaveParams saveParams) {
        saveParams.setPermission(ACL.PERMISSION_READ);
        this.aclService.save(saveParams);
        return this.getResult();
    }
}
