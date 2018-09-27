package motorcli.example.entity.sys;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

/**
 * 访问控制列表实体
 */
@Entity
@Getter
@Setter
@Table(name = "t_sys_acl")
public class ACL {

    /**
     * 读取权限
     */
    public static final int PERMISSION_READ = 0x000001;

    /**
     * 新建权限
     */
    public static final int PERMISSION_CREATE = 0x000002;

    /**
     * 修改权限
     */
    public static final int PERMISSION_UPDATE = 0x000004;

    /**
     * 删除权限
     */
    public static final int PERMISSION_DELETE = 0x000008;

    @Id
    @GeneratedValue(generator = "UUID")
    @Column(length = 36)
    private String id;

    /**
     * 扮演者ID
     */
    @Column(length = 36, nullable = false)
    private String actorId;

    /**
     * 资源ID
     */
    @Column(length = 36, nullable = false)
    private String resourceId;

    /**
     * 权限
     */
    @Column(precision = 6, nullable = false)
    private int permission;

    /**
     * 判断是否具有权限
     * @param permission 权限
     * @return true 为具有， false 为没有
     */
    public boolean hasPermission(int permission) {
        if((this.permission & permission) != 0) {
            return true;
        }
        return false;
    }

    /**
     * 添加权限
     * @param permission 权限
     */
    public void addPermission(int permission) {
        this.permission = this.permission | permission;
    }

    /**
     * 删除权限
     * @param permission 权限
     */
    public void removePermission(int permission) {
        this.permission = this.permission & (~permission);
    }
}
