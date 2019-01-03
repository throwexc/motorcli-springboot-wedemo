package motorcli.example.service.sys.impl;

import motorcli.example.emnus.sys.ACLType;
import motorcli.example.emnus.sys.ResourceType;
import motorcli.example.entity.sys.*;
import motorcli.example.entity.sys.Module;
import motorcli.example.mapper.sys.ACLMapper;
import motorcli.example.mapper.sys.ResourceMapper;
import motorcli.example.mapper.sys.UserAndRoleRelationMapper;
import motorcli.example.mapper.sys.UserMapper;
import com.motorcli.springboot.common.utils.CollectionUtils;
import motorcli.example.dto.sys.ModuleModel;
import motorcli.example.emnus.common.DataState;
import motorcli.example.exceptions.DataRepeatException;
import motorcli.example.exceptions.ExistChildCanNotDeleteException;
import motorcli.example.exceptions.NotAffectedDataException;
import motorcli.example.exceptions.sys.ACLTypeNotFoundException;
import motorcli.example.mapper.sys.*;
import motorcli.example.service.sys.ModuleService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class ModuleServiceImpl implements ModuleService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private ACLMapper aclMapper;

    @Autowired
    private UserAndRoleRelationMapper userAndRoleRelationMapper;

    @Autowired
    private ResourceMapper resourceMapper;

    @Autowired
    private ModuleMapper moduleMapper;

    @Override
    @Transactional
    public Module save(ModuleModel model) {
        Resource resource;
        Module module;

        Module urlCheckModule = this.moduleMapper.queryByModuleUrl(model.getModuleUrl());
        if(!StringUtils.isEmpty(model.getId())) {
            module = this.moduleMapper.queryById(model.getId());
            if(urlCheckModule != null && !urlCheckModule.getId().equals(module.getId())) {
                throw new DataRepeatException("模块链接地址", model.getModuleUrl());
            }
            resource = module.getResource();
        } else {
            module = new Module();
            if(urlCheckModule != null) {
                throw new DataRepeatException("模块链接地址", model.getModuleUrl());
            }
            resource = new Resource();
        }

        if(!StringUtils.isEmpty(model.getParentId())) {
            resource.setParentId(model.getParentId());
        }

        this.setEntityValues(model, resource, module);

        int resourceSaveFlag;
        int moduleSaveFlag;


        if(StringUtils.isEmpty(module.getId())) {
            String id = UUID.randomUUID().toString();
            module.setId(id);
            resource.setId(id);
            resourceSaveFlag = this.resourceMapper.insert(resource);
            moduleSaveFlag = this.moduleMapper.insert(module);
        } else {
            resourceSaveFlag = this.resourceMapper.updateByPrimaryKey(resource);
            moduleSaveFlag = this.moduleMapper.updateByPrimaryKey(module);
        }

        if(resourceSaveFlag <= 0 || moduleSaveFlag <= 0) {
            throw new NotAffectedDataException();
        }

        module.setResource(resource);

        return module;
    }

    @Override
    @Transactional
    public void deleteById(String id) {
        List<Module> children = this.moduleMapper.queryByParentId(id);
        if(!CollectionUtils.isEmpty(children)) {
            throw new ExistChildCanNotDeleteException();
        }
        //删除访问控制列表
        this.aclMapper.deleteByResourceId(id);
        //删除模块信息
        this.moduleMapper.deleteByPrimaryKey(id);
        //删除资源信息
        this.resourceMapper.deleteByPrimaryKey(id);
    }

    @Override
    public List<Module> queryAll() {
        return this.moduleMapper.queryAll();
    }

    @Override
    public List<Module> queryUserSysModule(String userId) {

        User user = this.userMapper.queryById(userId);

        if(user == null) {
            return new ArrayList<>();
        }

        Map<String, ACL> checkResult = this.getAclList(user, ACL.PERMISSION_READ);

        List<Module> list;

        if(checkResult != null && checkResult.size() > 0) {
            list = this.moduleMapper.queryByStateAndInIds(DataState.ENABLE.code(), checkResult.keySet());
        } else {
            list = new ArrayList<>();
        }

        return list;
    }

    /**
     * 设置实体对象值
     * @param moduleModel DTO 对象
     * @param resource 资源实体对象
     * @param module 模块实体对象
     */
    private void setEntityValues(ModuleModel moduleModel, Resource resource, Module module) {
        if(!StringUtils.isEmpty(moduleModel.getName())) {
            resource.setName(moduleModel.getName());
        } else {
            resource.setName(null);
        }

        if(!StringUtils.isEmpty(moduleModel.getModuleUrl())) {
            module.setModuleUrl(moduleModel.getModuleUrl());
        } else {
            module.setModuleUrl(null);
        }

        if(!StringUtils.isEmpty(moduleModel.getModuleIcon())) {
            module.setModuleIcon(moduleModel.getModuleIcon());
        } else {
            module.setModuleIcon(null);
        }


        resource.setOrderNum(moduleModel.getOrderNum());
        resource.setDataState(DataState.stateOf(moduleModel.getDataState()).code());

        if(!StringUtils.isEmpty(moduleModel.getDescription())) {
            resource.setDescription(moduleModel.getDescription());
        } else {
            resource.setDescription(null);
        }

        resource.setResourceType(ResourceType.typeOf(moduleModel.getResourceType()).code());
    }

    /**
     * 给定一个角色，把这个角色具有权限的ACL放入Map中
     * @param role 角色
     * @return <resourceId, ACL>
     */
    private Map<String, ACL> getAclList(Role role, int permission) {
        Map<String, ACL> temp = new HashMap<>();

        List<ACL> aclList = this.aclMapper.queryByActorId(role.getId());

        for (ACL tempAcl : aclList) {
            // 把角色的ACL放入Map，并过滤掉相同的ACL记录
            ACL roleAcl = temp.get(tempAcl.getResourceId());
            if (roleAcl != null) {
                if (tempAcl.hasPermission(permission)) {
                    temp.put(tempAcl.getResourceId(), tempAcl);
                }
            } else {
                if (tempAcl.hasPermission(permission)) {
                    temp.put(tempAcl.getResourceId(), tempAcl);
                }
            }
        }

        return temp;
    }

    /**
     * 给定一个用户，把这个用户具有权限的ACL放入Map中
     * @param user 用户
     * @return <resourceId, ACL>
     */
    private Map<String, ACL> getAclList(User user, int permission) {
        Map<String, ACL> temp = new HashMap<>();
        ACLType aclType = ACLType.typeOf(user.getActor().getAclType());
        // 判断用户的授权类型
        switch (aclType) {
            case SUPER: {
                // 为用户设置所有权限
                List<Module> modules = this.moduleMapper.queryAll();
                for (Module module : modules) {
                    ACL tempAcl = new ACL();
                    tempAcl.setActorId(user.getId());
                    tempAcl.setResourceId(module.getId());
                    tempAcl.addPermission(permission);
                    temp.put(module.getId(), tempAcl);
                }
            }
            break;
            case USER: {
                // 读取用户权限
                List<ACL> userList = this.aclMapper.queryByActorId(user.getId());
                for (ACL acl : userList) {
                    if (acl.hasPermission(permission)) {
                        temp.put(acl.getResourceId(), acl);
                    }
                }
            }
            break;
            case ROLE: {
                // 读取该用户的角色
                List<Role> roles = this.userAndRoleRelationMapper.queryRoleByUserId(user.getId());
                // 通过角色列表查询所有的ACL列表
                for (Role role : roles) {
                    temp.putAll(this.getAclList(role, permission));
                }
            }
            break;
            case ROLE_USER: {
                // 读取用户权限
                List<ACL> userList = this.aclMapper.queryByActorId(user.getId());
                for (ACL acl : userList) {
                    if (acl.hasPermission(ACL.PERMISSION_READ)) {
                        temp.put(acl.getResourceId(), acl);
                    }
                }
                List<Role> roles = this.userAndRoleRelationMapper.queryRoleByUserId(user.getId());
                // 通过角色列表查询所有的ACL列表
                for (Role role : roles) {
                    temp.putAll(this.getAclList(role, permission));
                }
            }
            break;
            default: {
                throw new ACLTypeNotFoundException(user.getActor().getAclType() + "");
            }
        }
        return temp;
    }
}
