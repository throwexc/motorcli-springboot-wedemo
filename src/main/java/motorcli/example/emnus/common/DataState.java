package motorcli.example.emnus.common;

import motorcli.example.exceptions.EnumNotFoundException;
import motorcli.example.exceptions.EnumNotFoundException;
import motorcli.example.exceptions.EnumNotFoundException;

public enum  DataState {

    DELETE(-99, "已删除"),
    DISABLE(0, "已禁用"),
    ENABLE(1, "已启用")
            ;

    private int code;
    private String info;

    DataState(int code, String info) {
        this.code = code;
        this.info = info;
    }

    public int code() {
        return code;
    }

    public String info() {
        return info;
    }

    public static DataState stateOf(int status) throws EnumNotFoundException {
        for(DataState s : values()) {
            if(s.code() == status) {
                return s;
            }
        }
        throw new EnumNotFoundException("数据状态");
    }
}
