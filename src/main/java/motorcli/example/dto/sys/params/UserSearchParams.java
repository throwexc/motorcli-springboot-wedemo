package motorcli.example.dto.sys.params;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import motorcli.example.dto.common.params.PageSearchParams;

import javax.servlet.http.HttpServletRequest;

@Getter
@Setter
@ApiModel("用户查询参数")
public class UserSearchParams extends PageSearchParams {

    @ApiModelProperty("单位名称")
    private String unitId;

    @ApiModelProperty("姓名")
    private String name;

    @ApiModelProperty("联系电话")
    private String phone;

    @ApiModelProperty("关键字")
    private String keywords;

    @ApiModelProperty("是否可操作")
    private Boolean operable;

    public UserSearchParams(HttpServletRequest request) {
        super(request);
    }
}
