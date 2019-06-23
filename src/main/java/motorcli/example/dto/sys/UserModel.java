package motorcli.example.dto.sys;

import com.motorcli.springboot.common.dto.DataModel;
import com.motorcli.springboot.common.utils.CollectionUtils;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import motorcli.example.entity.sys.Actor;
import motorcli.example.entity.sys.Role;
import motorcli.example.entity.sys.User;

@Getter
@Setter
@ApiModel("用户信息")
public class UserModel extends DataModel<User> {

    @ApiModelProperty("id")
    protected String id;

    @ApiModelProperty("姓名")
    protected String name;

    @ApiModelProperty("用户名")
    private String username;

    @ApiModelProperty("密码")
    private String password;

    @ApiModelProperty("用户状态")
    private Integer dataState;

    @ApiModelProperty("性别")
    private String sex;

    @ApiModelProperty("电话")
    private String phone;

    @ApiModelProperty("电子邮件")
    private String email;

    @ApiModelProperty("出生日期")
    private String birthday;

    @ApiModelProperty("照片文件ID")
    private String createTime;

    @ApiModelProperty("有效时间")
    private String activeTime;

    @ApiModelProperty("单位ID")
    private String unitId;

    @ApiModelProperty("单位名称")
    private String unitName;

    @ApiModelProperty("备注")
    private String remark;

    @ApiModelProperty("头像图片地址")
    private String headImgUrl;

    @ApiModelProperty("角色信息")
    private String roles;

    public UserModel() {
        super();
    }

    public UserModel(User user) {
        super(user);
    }

    public void setValues(User user) {
        if(user.getActor() != null) {
            Actor actor = user.getActor();
            this.name = actor.getName();
        }
        if(user.getUnit() != null) {
            this.unitName = user.getUnit().getName();
        }
        if(!CollectionUtils.isEmpty(user.getRoles())) {
            this.roles = "";
            int index = 0;
            for(Role role : user.getRoles()) {
                if(index != 0) {
                    this.roles += ",";
                }
                this.roles += role.getActor().getName();
                index++;
            }
        } else {
            this.roles = "";
        }
    }
}
