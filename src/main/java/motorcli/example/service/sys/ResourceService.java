package motorcli.example.service.sys;

import motorcli.example.dto.sys.CheckedResourceModel;
import motorcli.example.dto.sys.CheckedResourceModel;
import motorcli.example.dto.sys.CheckedResourceModel;

import java.util.List;

public interface ResourceService {

    /**
     * 获取扮演者资源权限
     * 如果资源有读取权限，则 checked 为 true
     * @param actorId 扮演者ID
     */
    List<CheckedResourceModel> queryCheckedModelByActorId(String actorId);

    /**
     * 获取扮演者资源权限
     * 如果资源有读取权限，则 checked 为 true
     * @param actorId 扮演者ID
     * @param topId 顶级资源ID
     */
    List<CheckedResourceModel> queryCheckedModelByActorId(String actorId, String topId);
}
