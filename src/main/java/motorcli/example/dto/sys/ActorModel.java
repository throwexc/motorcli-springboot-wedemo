package motorcli.example.dto.sys;

import motorcli.example.entity.sys.Actor;
import com.motorcli.springboot.restfull.dto.EntityDataModel;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import motorcli.example.entity.sys.Actor;
import motorcli.example.entity.sys.Actor;

@Getter
@Setter
@ApiModel("扮演者信息")
public class ActorModel extends EntityDataModel<Actor> {

    @ApiModelProperty("id")
    protected String id;

    @ApiModelProperty("姓名")
    protected String name;

    @ApiModelProperty("备注")
    protected String remark;

    public ActorModel() {
        super();
    }

    public ActorModel(Actor entity) {
        super(entity);
    }
}
