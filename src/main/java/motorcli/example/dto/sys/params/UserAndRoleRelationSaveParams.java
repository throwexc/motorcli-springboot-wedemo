package motorcli.example.dto.sys.params;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@ApiModel("用户分配角色提交参数")
public class UserAndRoleRelationSaveParams {

    @ApiModelProperty("用户ID")
    private String userId;

    @ApiModelProperty("角色ID集合")
    private List<String> roleIds;

    @ApiModelProperty("是否重置用户角色")
    private boolean reset = false;
}
