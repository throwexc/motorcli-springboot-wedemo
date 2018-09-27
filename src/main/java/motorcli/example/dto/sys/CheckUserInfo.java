package motorcli.example.dto.sys;

import lombok.Getter;

/**
 * 用户校验数据传输对象
 */
@Getter
public class CheckUserInfo {

    private UserModel user;

    private String msg;

    private boolean success;

    public CheckUserInfo(UserModel user, String msg, boolean success) {
        this.user = user;
        this.msg = msg;
        this.success = success;
    }
}
