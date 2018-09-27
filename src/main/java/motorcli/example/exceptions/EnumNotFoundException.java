package motorcli.example.exceptions;

import com.motorcli.springboot.common.exceptions.BaseException;

public class EnumNotFoundException extends BaseException {

    public EnumNotFoundException(String type) {
        super("[" + type + "]" + ExceptionEnum.ENUM_NOT_FOUND_EXCEPTION.info());
    }

    public EnumNotFoundException(String type, Throwable cause) {
        super("[" + type + "]" + ExceptionEnum.ENUM_NOT_FOUND_EXCEPTION.info(), cause);
    }

    @Override
    public int errorCode() {
        return ExceptionEnum.ENUM_NOT_FOUND_EXCEPTION.code();
    }
}
