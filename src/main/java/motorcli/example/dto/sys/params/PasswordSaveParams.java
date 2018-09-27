package motorcli.example.dto.sys.params;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * 密码参数
 */
@Getter
@Setter
@ApiModel("密码参数")
public class PasswordSaveParams {

    @ApiModelProperty("用户ID集合")
    private List<String> userIds;

    @ApiModelProperty("密码")
    private String password;

    @ApiModelProperty("原密码")
    private String oldPassword;

}
