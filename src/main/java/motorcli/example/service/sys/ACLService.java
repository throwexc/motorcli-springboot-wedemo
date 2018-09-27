package motorcli.example.service.sys;

import motorcli.example.dto.sys.params.ACLSaveParams;
import motorcli.example.dto.sys.params.ACLSaveParams;
import motorcli.example.dto.sys.params.ACLSaveParams;

public interface ACLService {

    /**
     * 保存访问控制列表
     * @param saveParams 保存参数
     */
    void save(ACLSaveParams saveParams);
}
