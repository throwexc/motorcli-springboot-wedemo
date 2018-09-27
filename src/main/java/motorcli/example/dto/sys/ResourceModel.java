package motorcli.example.dto.sys;

import motorcli.example.entity.sys.Resource;
import com.motorcli.springboot.restfull.dto.TreeEntityDataModel;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import motorcli.example.entity.sys.Resource;
import motorcli.example.entity.sys.Resource;

@Getter
@Setter
@ApiModel("系统资源信息")
public class ResourceModel extends TreeEntityDataModel<Resource> {

    @ApiModelProperty("资源名称")
    protected String name;

    @ApiModelProperty("数据状态")
    protected Integer dataState;

    @ApiModelProperty("资源描述")
    protected String description;

    @ApiModelProperty("排序号")
    protected Long orderNum;

    @ApiModelProperty("资源类型")
    protected Integer resourceType;

    public ResourceModel() {
        super();
    }

    public ResourceModel(Resource resource) {
        super(resource);
    }
}
