package motorcli.example.dto.sys;

import motorcli.example.entity.sys.Role;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import motorcli.example.entity.sys.Role;
import motorcli.example.entity.sys.Role;

@Getter
@Setter
@ApiModel("系统角色数据, 带有权限判定")
public class CheckedRoleModel extends RoleModel {

    @ApiModelProperty("是否具有判别字段")
    private Boolean checked;

    public CheckedRoleModel() {
        super();
    }

    public CheckedRoleModel(Role model) {
        super(model);
    }

    public CheckedRoleModel(Role model, boolean checked) {
        super(model);
        this.checked = checked;
    }
}
