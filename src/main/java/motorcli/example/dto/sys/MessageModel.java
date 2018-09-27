package motorcli.example.dto.sys;

import com.motorcli.springboot.common.dto.BaseDataModel;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("系统消息")
public class MessageModel extends BaseDataModel {

    @ApiModelProperty("id")
    private String id;

    @ApiModelProperty("发送用户")
    private String pushUserId;

    @ApiModelProperty("接收用户")
    private String receiveUserId;

    @ApiModelProperty("所属社区")
    private String areaId;

    @ApiModelProperty("标题")
    private String title;

    @ApiModelProperty("内容")
    private String content;

    @ApiModelProperty("创建时间")
    private String createTime;

    @ApiModelProperty("阅读时间")
    private String readTime;

    @ApiModelProperty("分组ID")
    private String groupId;

    @ApiModelProperty("实体ID")
    private String entityId;

    @ApiModelProperty("消息状态")
    private int status;

    @ApiModelProperty("消息状态信息")
    private String statusInfo;

    @ApiModelProperty("消息类型")
    private int msgType;

    @ApiModelProperty("消息类型信息")
    private String msgTypeInfo;
}
