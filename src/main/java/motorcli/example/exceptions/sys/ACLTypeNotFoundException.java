package motorcli.example.exceptions.sys;

import motorcli.example.exceptions.BusException;

public class ACLTypeNotFoundException extends BusException {

    public ACLTypeNotFoundException(String aclType) {
        super("没有找到授权类型 [ " + aclType + " ]");
    }

    public ACLTypeNotFoundException(String aclType, Throwable cause) {
        super("没有找到授权类型 [ " + aclType + " ]", cause);
    }
}
