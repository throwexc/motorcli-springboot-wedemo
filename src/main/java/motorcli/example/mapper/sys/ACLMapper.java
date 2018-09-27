package motorcli.example.mapper.sys;

import motorcli.example.entity.sys.ACL;
import motorcli.example.entity.sys.ACL;
import motorcli.example.entity.sys.ACL;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;

public interface ACLMapper extends Mapper<ACL> {

    /**
     * 查询访问控制列表
     * @param actorId 扮演者ID
     */
    List<ACL> queryByActorId(String actorId);

    /**
     * 删除访问控制列表
     * @param resourceId 资源ID
     */
    int deleteByResourceId(String resourceId);

    /**
     * 删除访问控制列表
     * @param actorId 扮演者ID
     */
    int deleteByActorId(String actorId);
}
