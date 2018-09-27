package motorcli.example.service.sys.impl;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import motorcli.example.dto.sys.RoleModel;
import motorcli.example.dto.sys.params.RoleSearchParams;
import motorcli.example.entity.sys.Actor;
import motorcli.example.entity.sys.Role;
import motorcli.example.mapper.sys.ACLMapper;
import motorcli.example.mapper.sys.ActorMapper;
import motorcli.example.mapper.sys.RoleMapper;
import motorcli.example.mapper.sys.UserAndRoleRelationMapper;
import motorcli.example.dto.sys.RoleModel;
import motorcli.example.dto.sys.params.RoleSearchParams;
import motorcli.example.entity.sys.Actor;
import motorcli.example.entity.sys.Role;
import motorcli.example.exceptions.NotAffectedDataException;
import motorcli.example.mapper.sys.ACLMapper;
import motorcli.example.mapper.sys.ActorMapper;
import motorcli.example.mapper.sys.RoleMapper;
import motorcli.example.mapper.sys.UserAndRoleRelationMapper;
import motorcli.example.service.sys.RoleService;
import motorcli.example.dto.sys.RoleModel;
import motorcli.example.dto.sys.params.RoleSearchParams;
import motorcli.example.entity.sys.Actor;
import motorcli.example.entity.sys.Role;
import motorcli.example.mapper.sys.ACLMapper;
import motorcli.example.mapper.sys.ActorMapper;
import motorcli.example.mapper.sys.RoleMapper;
import motorcli.example.mapper.sys.UserAndRoleRelationMapper;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private ActorMapper actorMapper;

    @Autowired
    private RoleMapper roleMapper;

    @Autowired
    private ACLMapper aclMapper;

    @Autowired
    private UserAndRoleRelationMapper userAndRoleRelationDao;

    @Override
    public List<Role> queryAll() {
        return this.roleMapper.queryAll();
    }

    @Override
    public List<Role> search(RoleSearchParams searchParams) {
        return this.roleMapper.search(searchParams);
    }

    @Override
    public Page<Role> searchPage(RoleSearchParams searchParams) {
        Page<Role> pageInfo = PageHelper.startPage(searchParams.getPageNum(), searchParams.getPageSize()).doSelectPage(() -> {
            roleMapper.search(searchParams);
        });
        return pageInfo;
    }

    @Override
    public Role save(RoleModel model) {
        Actor actor;
        Role role;
        if(!StringUtils.isEmpty(model.getId())) {
            role = this.roleMapper.queryById(model.getId());
            actor = role.getActor();
        } else {
            role = new Role();
            actor = new Actor();
        }

        actor.setName(model.getName());

        if(!StringUtils.isEmpty(model.getRemark())) {
            actor.setRemark(model.getRemark());
        } else {
            actor.setRemark(null);
        }

        int actorSaveFlag;
        int roleSaveFlag;

        if(StringUtils.isEmpty(actor.getId())) {
            String id = UUID.randomUUID().toString();
            actor.setId(id);
            role.setId(id);

            actorSaveFlag = this.actorMapper.insert(actor);
            roleSaveFlag = this.roleMapper.insert(role);
        } else {
            actorSaveFlag = this.actorMapper.updateByPrimaryKey(actor);
            roleSaveFlag = 1; // TODO 角色中还没有要更新的字段
            //roleSaveFlag = this.roleDao.updateByPrimaryKey(role);
        }

        if(actorSaveFlag <= 0 || roleSaveFlag <= 0) {
            throw new NotAffectedDataException();
        }

        role.setActor(actor);

        return role;
    }

    @Override
    public void deleteById(String id) {
        //删除访问控制列表
        this.aclMapper.deleteByActorId(id);
        //删除角色与用户的关联
        this.userAndRoleRelationDao.deleteByRoleId(id);
        //删除角色
        this.roleMapper.deleteByPrimaryKey(id);
    }

    @Override
    @Transactional
    public void deleteByIdSet(Set<String> idSet) {
        for(String id : idSet) {
            this.deleteById(id);
        }
    }
}
