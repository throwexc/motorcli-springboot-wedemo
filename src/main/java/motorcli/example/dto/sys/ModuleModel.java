package motorcli.example.dto.sys;

import motorcli.example.entity.sys.Module;
import motorcli.example.entity.sys.Resource;
import com.motorcli.springboot.restfull.dto.TreeEntityDataModel;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import motorcli.example.entity.sys.Module;
import motorcli.example.entity.sys.Resource;
import motorcli.example.entity.sys.Module;
import motorcli.example.entity.sys.Resource;

@Getter
@Setter
@ApiModel("模块信息")
public class ModuleModel extends TreeEntityDataModel<Module> {

    @ApiModelProperty("模块名称")
    protected String name;

    @ApiModelProperty("数据状态")
    protected Integer dataState;

    @ApiModelProperty("模块描述")
    protected String description;

    @ApiModelProperty("排序号")
    protected Long orderNum;

    @ApiModelProperty("模块类型")
    protected Integer resourceType;

    @ApiModelProperty("用户接口")
    private String moduleUrl;

    @ApiModelProperty("图标")
    private String moduleIcon;

    public ModuleModel() {
        super();
    }

    public ModuleModel(Module module) {
        super(module);
    }

    @Override
    public void setValues(Module module) {
        if(module.getResource() != null) {
            Resource resource = module.getResource();
            this.name = resource.getName();
            this.dataState = resource.getDataState();
            this.description = resource.getDescription();
            this.orderNum = resource.getOrderNum();
            this.resourceType = resource.getResourceType();
            this.parentId = resource.getParentId();
        }
    }
}
