package motorcli.example.exceptions;

import com.motorcli.springboot.common.exceptions.BaseException;

public class BusException extends BaseException {

    public BusException(String message) {
        super(message);
    }

    public BusException(String message, Throwable cause) {
        super(message, cause);
    }

    @Override
    public int errorCode() {
        return ExceptionEnum.BUS_EXCEPTION.code();
    }
}
