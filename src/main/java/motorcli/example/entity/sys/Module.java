package motorcli.example.entity.sys;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@Table(name = "t_sys_module")
public class Module {

    @Id
    private String id;

    /**
     * 接口地址
     */
    @Column(length = 300, nullable = false)
    private String moduleUrl;

    /**
     * 图标
     */
    @Column(length = 120)
    private String moduleIcon;

    /**
     * 系统资源
     */
    @Transient
    private Resource resource;
}
