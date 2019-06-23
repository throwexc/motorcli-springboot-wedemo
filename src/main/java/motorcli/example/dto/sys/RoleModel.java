package motorcli.example.dto.sys;

import com.motorcli.springboot.common.dto.DataModel;
import motorcli.example.entity.sys.Role;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("角色信息")
public class RoleModel extends DataModel<Role> {

    @ApiModelProperty("id")
    private String id;

    @ApiModelProperty("名称")
    private String name;

    @ApiModelProperty("描述")
    private String remark;

    public RoleModel() {
        super();
    }

    public RoleModel(Role role) {
        super(role);
    }

    @Override
    public void setValues(Role role) {
        if(role.getActor() != null) {
            this.name = role.getActor().getName();
            this.remark = role.getActor().getRemark();
        }
    }
}
