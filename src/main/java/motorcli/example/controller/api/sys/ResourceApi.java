package motorcli.example.controller.api.sys;

import motorcli.example.dto.sys.CheckedResourceModel;
import motorcli.example.service.sys.ResourceService;
import com.motorcli.springboot.restful.result.ResultItems;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import motorcli.example.common.base.BaseApi;
import motorcli.example.dto.sys.CheckedResourceModel;
import motorcli.example.service.sys.ResourceService;
import motorcli.example.dto.sys.CheckedResourceModel;
import motorcli.example.service.sys.ResourceService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/sys/resource")
@Api(value = "系统资源")
public class ResourceApi extends BaseApi {

    @Autowired
    private ResourceService resourceService;

    @RequestMapping(value = "/actor/check/resources", method = RequestMethod.GET)
    @ApiOperation(value = "查询扮演者资源权限", notes = "查询资源，如果具有读取权限，标记资源")
    public ResultItems<CheckedResourceModel> resources(@RequestParam(required = false) @ApiParam("扮演者ID") String actorId) {
        if(StringUtils.isEmpty(actorId)) {
            return this.getResult(new ArrayList<>());
        }
        List<CheckedResourceModel> list = this.resourceService.queryCheckedModelByActorId(actorId);
        return this.getResult(list);
    }
}
