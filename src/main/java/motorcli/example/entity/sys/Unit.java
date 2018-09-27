package motorcli.example.entity.sys;

import lombok.Getter;
import lombok.Setter;
import motorcli.example.emnus.common.DataState;
import motorcli.example.emnus.sys.UnitType;

import javax.persistence.*;
import java.util.Date;

/**
 *  部门
 */
@Entity
@Getter
@Setter
@Table(name="t_sys_unit")
public class Unit {

    @Id
    @GeneratedValue(generator = "UUID")
    @Column(length = 36)
    private String id;

    /**
     * 名称
     */
    @Column(length = 50, nullable = false)
    private String name;

    /**
     * 数据状态
     */
    @Column(precision = 4, nullable = false)
    private int dataState = DataState.ENABLE.code();

    /**
     * 类型
     */
    @Column(precision = 4, nullable = false)
    private int unitType = UnitType.UNIT.code();

    /**
     * 排序号
     */
    private int orderNum;

    /**
     * 备注
     */
    @Column(length = 200)
    private String remark;

    /**
     * 父点节ID
     */
    @Column(length = 36)
    private String parentId;

    /**
     * 创建时间
     */
    @Column(nullable = false)
    private Date createTime;

    /**
     * 修改时间
     */
    @Column(nullable = false)
    private Date updateTime;
}
