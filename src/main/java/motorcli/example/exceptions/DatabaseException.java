package motorcli.example.exceptions;

import com.motorcli.springboot.common.exceptions.BaseException;

public class DatabaseException extends BaseException {

    public DatabaseException(String message) {
        super(message);
    }

    public DatabaseException(String message, Throwable cause) {
        super(message, cause);
    }

    @Override
    public int errorCode() {
        return ExceptionEnum.DATABASE_EXCEPTION.code();
    }
}
