package motorcli.example.entity.sys;

import motorcli.example.emnus.sys.ResourceType;
import lombok.Getter;
import lombok.Setter;
import motorcli.example.emnus.common.DataState;
import motorcli.example.emnus.sys.ResourceType;
import motorcli.example.emnus.sys.ResourceType;

import javax.persistence.*;

/**
 * 系统资源
 * 系统中所有资源都将进入该表，子类可对其扩展
 */
@Entity
@Getter
@Setter
@Table(name = "t_sys_resource")
public class Resource {

    @Id
    @GeneratedValue(generator = "UUID")
    @Column(length = 36)
    private String id;

    /**
     * 资源名称
     */
    @Column(length = 50, nullable = false)
    private String name;

    /**
     * 数据状态
     */
    @Column(precision = 4, nullable = false)
    private int dataState = DataState.ENABLE.code();

    /**
     * 资源描述
     */
    @Column(length = 200)
    private String description;

    /**
     * 排序号
     */
    @Column(precision = 20, nullable = false)
    private long orderNum;

    /**
     * 资源类型
     */
    @Column(precision = 4, nullable = false)
    private int resourceType = ResourceType.MODULE.code();

    /**
     * 父节点ID
     */
    @Column(length = 36)
    private String parentId;
}
