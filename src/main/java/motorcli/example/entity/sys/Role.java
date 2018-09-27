package motorcli.example.entity.sys;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

/**
 * 角色
 */
@Entity
@Getter
@Setter
@Table(name = "t_sys_role")
public class Role {

    @Id
    private String id;

    /**
     * 扮演者信息
     */
    @Transient
    private Actor actor;
}
