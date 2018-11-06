package motorcli.example.dto.sys.params;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("角色查询参数")
public class RoleSearchParams {

    @ApiModelProperty("角色名称")
    private String name;

    @ApiModelProperty(value = "页码", example = "1")
    private Integer pageNum;

    @ApiModelProperty(value = "页长", example = "10")
    private Integer pageSize;
}
