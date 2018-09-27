package motorcli.example.service.sys.impl;

import motorcli.example.dto.sys.CheckedResourceModel;
import motorcli.example.entity.sys.ACL;
import motorcli.example.entity.sys.Resource;
import motorcli.example.mapper.sys.ACLMapper;
import motorcli.example.mapper.sys.ResourceMapper;
import com.motorcli.springboot.restfull.dto.converter.TreeDataChanger;
import motorcli.example.dto.sys.CheckedResourceModel;
import motorcli.example.entity.sys.ACL;
import motorcli.example.entity.sys.Resource;
import motorcli.example.mapper.sys.ACLMapper;
import motorcli.example.mapper.sys.ResourceMapper;
import motorcli.example.service.sys.ResourceService;
import motorcli.example.dto.sys.CheckedResourceModel;
import motorcli.example.entity.sys.ACL;
import motorcli.example.entity.sys.Resource;
import motorcli.example.mapper.sys.ACLMapper;
import motorcli.example.mapper.sys.ResourceMapper;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ResourceServiceImpl implements ResourceService {

    @Autowired
    private ResourceMapper resourceMapper;

    @Autowired
    private ACLMapper aclMapper;

    @Override
    public List<CheckedResourceModel> queryCheckedModelByActorId(String actorId) {
        return this.queryCheckedModelByActorId(actorId, null);
    }

    @Override
    public List<CheckedResourceModel> queryCheckedModelByActorId(String actorId, String topId) {
        List<Resource> resourceList = this.resourceMapper.queryAll();
        List<ACL> aclList = this.aclMapper.queryByActorId(actorId);

        Map<String, ACL> aclMap = new HashMap<>();

        for(ACL acl : aclList) {
            aclMap.put(acl.getResourceId(), acl);
        }

        List<CheckedResourceModel> resultList = new ArrayList<>();

        for (Resource resource : resourceList) {
            ACL acl = aclMap.get(resource.getId());
            if(acl != null && acl.hasPermission(ACL.PERMISSION_READ)) {
                resultList.add(new CheckedResourceModel(resource, true));
            } else {
                resultList.add(new CheckedResourceModel(resource, false));
            }
        }

        TreeDataChanger<CheckedResourceModel> dmt;
        if(!StringUtils.isEmpty(topId)) {
            dmt = new TreeDataChanger<>(resultList, topId);
        } else {
            dmt = new TreeDataChanger<>(resultList);
        }
        return dmt.toTree();
    }
}
