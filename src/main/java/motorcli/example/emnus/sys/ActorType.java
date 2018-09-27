package motorcli.example.emnus.sys;

import motorcli.example.exceptions.EnumNotFoundException;
import motorcli.example.exceptions.EnumNotFoundException;
import motorcli.example.exceptions.EnumNotFoundException;

/**
 * 扮演者类型
 */
public enum ActorType {

    INNER(-1, "内置"),
    NORMAL(1, "正常")
    ;

    private int code;
    private String info;

    ActorType(int code, String info) {
        this.code = code;
        this.info = info;
    }

    public int code() {
        return code;
    }

    public String info() {
        return info;
    }

    public static ActorType typeOf(int type) throws EnumNotFoundException {
        for (ActorType t : values()) {
            if (t.code() == type) {
                return t;
            }
        }
        throw new EnumNotFoundException("扮演者类型");
    }
}
