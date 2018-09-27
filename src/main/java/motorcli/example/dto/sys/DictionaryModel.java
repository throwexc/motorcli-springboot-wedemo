package motorcli.example.dto.sys;

import motorcli.example.entity.sys.Dictionary;
import com.motorcli.springboot.restfull.dto.TreeEntityDataModel;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import motorcli.example.entity.sys.Dictionary;
import motorcli.example.entity.sys.Dictionary;

@Getter
@Setter
@ApiModel("数据字典信息")
public class DictionaryModel extends TreeEntityDataModel<Dictionary> {

    @ApiModelProperty("key")
    private String key;

    @ApiModelProperty("value")
    private String value;

    @ApiModelProperty("label")
    private String label;

    @ApiModelProperty("排序号")
    private int orderNum;

    public DictionaryModel() {
        super();
    }

    public DictionaryModel(Dictionary dictionary) {
        super(dictionary);
    }
}
