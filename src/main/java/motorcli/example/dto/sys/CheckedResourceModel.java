package motorcli.example.dto.sys;

import motorcli.example.entity.sys.Resource;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import motorcli.example.entity.sys.Resource;
import motorcli.example.entity.sys.Resource;

@Getter
@Setter
@ApiModel("系统资源数据, 带有权限判定")
public class CheckedResourceModel extends ResourceModel {

    @ApiModelProperty("扮演者是否有读取权限判别字段")
    private Boolean checked;

    public CheckedResourceModel() {
        super();
    }

    public CheckedResourceModel(Resource model) {
        super(model);
    }

    public CheckedResourceModel(Resource model, boolean checked) {
        super(model);
        this.checked = checked;
    }
}
