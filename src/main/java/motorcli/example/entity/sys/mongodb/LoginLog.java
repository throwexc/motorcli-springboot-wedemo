package motorcli.example.entity.sys.mongodb;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class LoginLog {

    /**
     * ID
     */
    private String id;

    /**
     * IP 地址
     */
    private String ip;

    /**
     * Mac 地址
     */
    private String mac;

    /**
     * 创建见附件
     */
    private Date loginTime;

    /**
     * 用户ID
     */
    private String userId;

    /**
     * 日志内容
     */
    private String content;
}
