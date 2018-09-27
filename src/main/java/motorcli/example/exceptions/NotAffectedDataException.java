package motorcli.example.exceptions;

public class NotAffectedDataException extends DatabaseException {

    public NotAffectedDataException() {
        super(ExceptionEnum.DATABASE_EXCEPTION.info() + "[ 插入或更新记录时，没有受影响的记录 ]");
    }

    public NotAffectedDataException(Throwable cause) {
        super(ExceptionEnum.DATABASE_EXCEPTION.info() + "[ 插入或更新记录时，没有受影响的记录 ]", cause);
    }
}
