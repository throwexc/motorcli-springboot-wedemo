package motorcli.example.dto.sys.params;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import motorcli.example.dto.common.params.PageSearchParams;

import javax.servlet.http.HttpServletRequest;

@Getter
@Setter
@ApiModel("角色查询参数")
public class RoleSearchParams extends PageSearchParams {

    @ApiModelProperty("角色名称")
    private String name;

    public RoleSearchParams(HttpServletRequest request) {
        super(request);
    }
}
