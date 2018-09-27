package motorcli.example.dto.sys.params;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@ApiModel("访问控制列表保存参数")
public class ACLSaveParams {

    @ApiModelProperty("扮演者ID")
    private String actorId;

    @ApiModelProperty("资源ID")
    private List<String> resourceIds;

    @ApiModelProperty("是否重置扮演者权限")
    private boolean reset = false;

    @ApiModelProperty("权限")
    private int permission;
}
