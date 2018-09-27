package motorcli.example.exceptions;

public enum ExceptionEnum {


    /**
     * 枚举类型没有找到
     */
    ENUM_NOT_FOUND_EXCEPTION(1, "枚举类型没有找到"),

    /**
     * 数据库操作异常
     */
    DATABASE_EXCEPTION(2, "数据库操作异常"),

    /**
     * 业务逻辑异常
     */
    BUS_EXCEPTION(3, "业务逻辑异常")
    ;

    private static final int APP_BASE_EXCEPTION_CODE = -8000000;


    private int code;
    private String info;

    ExceptionEnum(int code, String info) {
        this.code = APP_BASE_EXCEPTION_CODE + (-1 * code);
        this.info = info;
    }

    public int code() {
        return code;
    }

    public String info() {
        return info;
    }
}
