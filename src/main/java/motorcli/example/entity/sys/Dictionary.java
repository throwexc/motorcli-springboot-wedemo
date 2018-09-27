package motorcli.example.entity.sys;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

/**
 * 数据字典
 */
@Entity
@Getter
@Setter
@Table(name = "t_sys_dictionary")
public class Dictionary {

    @Id
    @GeneratedValue(generator = "UUID")
    @Column(length = 36)
    private String id;

    /**
     * 键
     */
    @Column(name = "d_key", length = 200, nullable = false)
    private String key;

    /**
     * 显示
     */
    @Column(name = "d_label", length = 200, nullable = false)
    private String label;

    /**
     * 值
     */
    @Column(name = "d_value", length = 300, nullable = false)
    private String value;

    /**
     * 排序号
     */
    @Column(nullable = false)
    private int orderNum;

    /**
     * 父节点ID
     */
    @Column(length = 36)
    private String parentId;
}
