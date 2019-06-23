package motorcli.example.dto.sys;

import com.motorcli.springboot.restful.dto.TreeModel;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import motorcli.example.emnus.sys.UnitType;
import motorcli.example.entity.sys.Unit;

@Getter
@Setter
@ApiModel("部门信息")
public class UnitModel extends TreeModel<Unit> {

    @ApiModelProperty("部门名称")
    private String name;

    @ApiModelProperty("数据状态")
    private Integer dataState;

    @ApiModelProperty("排序号")
    private int orderNum;

    @ApiModelProperty("创建时间")
    private String createTime;

    @ApiModelProperty("部门类型代码")
    private Integer unitType;

    @ApiModelProperty("部门类型信息")
    private String unitTypeInfo;

    @ApiModelProperty("备注")
    private String remark;

    public UnitModel() {
        super();
    }

    public UnitModel(Unit unit) {
        super(unit);
    }

    @Override
    public void setValues(Unit unit) {
        this.unitTypeInfo = UnitType.typeOf(this.unitType).info();
    }
}
