package motorcli.example.emnus.sys;

import motorcli.example.exceptions.EnumNotFoundException;

/**
 * 授权类型
 */
public enum ACLType {
    /**
     * 超级用户，具有系统所有功能权限
     */
    SUPER(0, "超级授权"),

    /**
     * 用户授权
     */
    USER(1, "用户授权"),

    /**
     * 角色授权
     */
    ROLE(2, "角色授权"),

    /**
     * 继承授权，具有用户与角色的所有功能权限
     */
    ROLE_USER(3, "集成授权")
    ;

    private int code;
    private String info;

    ACLType(int code, String info) {
        this.code = code;
        this.info = info;
    }

    public int code() {
        return code;
    }

    public String info() {
        return info;
    }

    public static ACLType typeOf(int type) throws EnumNotFoundException {
        for (ACLType t : values()) {
            if(t.code() == type) {
                return t;
            }
        }
        throw new EnumNotFoundException("授权类型");
    }
}
