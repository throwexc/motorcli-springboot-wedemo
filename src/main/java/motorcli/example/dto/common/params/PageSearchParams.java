package motorcli.example.dto.common.params;

import com.motorcli.springboot.web.params.RequestSearchParams;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import javax.servlet.http.HttpServletRequest;

@Getter
@Setter
@ApiModel("分页查询参数")
public class PageSearchParams extends RequestSearchParams {

    @ApiModelProperty(value = "页码", example = "1")
    protected Integer pageNum;

    @ApiModelProperty(value = "页长", example = "10")
    protected Integer pageSize;

    public PageSearchParams(HttpServletRequest request) {
        super(request);
    }

    /**
     * 补全结束时间
     * 如果集成该类复写日期格式，需要重写该方法
     * @param endTime 结束时间字符串
     * @return 补全后的日期字符传
     */
    protected String endTimeCompleted(String endTime) {
        if(this.dateTimeFormat().length() > endTime.length()) {
            return endTime + " 23:59:59";
        }
        return endTime;
    }
}