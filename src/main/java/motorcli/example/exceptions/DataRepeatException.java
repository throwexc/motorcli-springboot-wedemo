package motorcli.example.exceptions;

public class DataRepeatException extends DatabaseException {

    public DataRepeatException(String key, String value) {
        super("[ " + key + " ] 重复, 值 [" + value + " ]");
    }

    public DataRepeatException(String key, String value, Throwable cause) {
        super("[ " + key + " ] 重复, 值 [" + value + " ]", cause);
    }
}
