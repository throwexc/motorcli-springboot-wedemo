package motorcli.example.service.sys.impl;

import motorcli.example.dto.sys.params.ACLSaveParams;
import motorcli.example.entity.sys.ACL;
import motorcli.example.mapper.sys.ACLMapper;
import com.motorcli.springboot.common.utils.CollectionUtils;
import motorcli.example.dto.sys.params.ACLSaveParams;
import motorcli.example.entity.sys.ACL;
import motorcli.example.mapper.sys.ACLMapper;
import motorcli.example.service.sys.ACLService;
import motorcli.example.dto.sys.params.ACLSaveParams;
import motorcli.example.entity.sys.ACL;
import motorcli.example.mapper.sys.ACLMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ACLServiceImpl implements ACLService {

    @Autowired
    private ACLMapper aclMapper;

    @Override
    @Transactional
    public void save(ACLSaveParams saveParams) {
        if(saveParams.isReset()){
            this.aclMapper.deleteByActorId(saveParams.getActorId());
        }
        if(!CollectionUtils.isEmpty(saveParams.getResourceIds())) {
            for(String resourceId : saveParams.getResourceIds()) {
                ACL acl = new ACL();
                acl.setId(UUID.randomUUID().toString());
                acl.setActorId(saveParams.getActorId());
                acl.setResourceId(resourceId);
                acl.setPermission(saveParams.getPermission());
                this.aclMapper.insert(acl);
            }
        }
    }
}
