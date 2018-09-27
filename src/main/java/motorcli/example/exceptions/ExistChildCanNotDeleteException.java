package motorcli.example.exceptions;

public class ExistChildCanNotDeleteException extends BusException {

    public ExistChildCanNotDeleteException() {
        super("存在子节点不可以删除");
    }

    public ExistChildCanNotDeleteException(Throwable cause) {
        super("存在子节点不可以删除", cause);
    }
}
