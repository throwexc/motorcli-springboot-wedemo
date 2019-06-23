package motorcli.example.dto.sys;

import com.motorcli.springboot.common.dto.DataModel;
import motorcli.example.entity.sys.Actor;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("扮演者信息")
public class ActorModel extends DataModel<Actor> {

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
