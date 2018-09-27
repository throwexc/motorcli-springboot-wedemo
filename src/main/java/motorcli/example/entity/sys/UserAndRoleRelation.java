package motorcli.example.entity.sys;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 角色用户关联
 */
@Entity
@Getter
@Setter
@Table(name = "t_sys_role_user")
public class UserAndRoleRelation {

    /**
     * 用户ID
     */
    @Id
    private String userId;

    /**
     * 角色ID
     */
    @Id
    private String roleId;
}
