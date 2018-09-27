package motorcli.example.entity.sys;

import lombok.Getter;
import lombok.Setter;
import motorcli.example.emnus.sys.ACLType;
import motorcli.example.emnus.sys.ActorType;

import javax.persistence.*;


/**
 * 系统使用者的基类，该类的派生类才可成主完成权限分配。
 * 继承了该类的所有子类，将为系统使用人的扮演者。
 * 所有扮演者的数据都将存储在同一张表中，所有具体的扮演者都有权限扩展该表。
 */
@Getter
@Setter
@Entity
@Table(name="t_sys_actor")
public class Actor {

    @Id
    @GeneratedValue(generator = "UUID")
    @Column(length = 36)
    protected String id;

    /**
     * 名称
     */
    @Column(length = 50, nullable = false)
    protected String name;

    /**
     * 扮演者类型
     */
    @Column(precision = 4, nullable = false)
    protected int actorType = ActorType.NORMAL.code();

    /**
     * 授权类型
     */
    @Column(precision = 4, nullable = false)
    protected int aclType = ACLType.ROLE.code();

    /**
     * 备注
     */
    @Column(length = 200)
    protected String remark;
}
