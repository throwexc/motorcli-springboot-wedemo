package motorcli.example.emnus.sys;


import motorcli.example.exceptions.EnumNotFoundException;
import motorcli.example.exceptions.EnumNotFoundException;
import motorcli.example.exceptions.EnumNotFoundException;

/**
 * 部门类型
 */
public enum UnitType {

    UNIT(1, "部门"),
    GROUP(2, "组")
    ;

    private int code;
    private String info;

    UnitType(int code, String info) {
        this.code = code;
        this.info = info;
    }

    public int code() {
        return code;
    }

    public String info() {
        return info;
    }

    public static UnitType typeOf(int type) throws EnumNotFoundException {
        for (UnitType t : values()) {
            if(t.code() == type) {
                return t;
            }
        }
        throw new EnumNotFoundException("部门类型");
    }
}
