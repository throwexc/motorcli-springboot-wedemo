package motorcli.example.emnus.sys;

import motorcli.example.exceptions.EnumNotFoundException;
import motorcli.example.exceptions.EnumNotFoundException;
import motorcli.example.exceptions.EnumNotFoundException;

/**
 * 资源类型
 */
public enum ResourceType {

    MODULE(1, "模块"),
    LINK(2, "链接"),
    FUNCTION(3, "功能权限")
    ;

    private int code;
    private String info;

    ResourceType(int code, String info) {
        this.code = code;
        this.info = info;
    }

    public int code() {
        return code;
    }

    public String info() {
        return info;
    }

    public static ResourceType typeOf(int type) throws EnumNotFoundException {
        for (ResourceType t : values()) {
            if(t.code() == type) {
                return t;
            }
        }
        throw new EnumNotFoundException("资源类型");
    }
}
