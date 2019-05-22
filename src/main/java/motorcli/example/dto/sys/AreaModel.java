package motorcli.example.dto.sys;

import com.motorcli.springboot.restful.dto.TreeModel;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import motorcli.example.entity.sys.Area;

import java.math.BigDecimal;

@Getter
@Setter
@ApiModel("区域信息")
public class AreaModel extends TreeModel<Area> {

    @ApiModelProperty("id")
    private String id;

    @ApiModelProperty("名称")
    private String name;

    @ApiModelProperty("短名称")
    private String shortName;

    @ApiModelProperty("经度")
    private BigDecimal longitude;

    @ApiModelProperty("纬度")
    private BigDecimal latitude;

    @ApiModelProperty("级别")
    private Integer level;

    @ApiModelProperty("排序")
    private Integer orderNum;

    @ApiModelProperty("邮政编码")
    private String postCode;

    @ApiModelProperty("行政区划编码")
    private String adCode;

    @ApiModelProperty("父节点ID")
    private String parentId;

    @ApiModelProperty("描述")
    private String remark;

    @ApiModelProperty("地址")
    private String address;

    @ApiModelProperty("是否为叶子节点")
    private boolean leaf;

    public AreaModel() {
        super();
    }

    public AreaModel(Area area) {
        super(area);
    }

    public AreaModel(Area area, boolean isLeaf) {
        super(area);
        this.leaf = isLeaf;
    }
}
