package motorcli.example.entity.sys;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.math.BigDecimal;

/**
 * 地区
 */
@Entity
@Getter
@Setter
@Table(name="t_sys_area")
public class Area {

    @Id
    @GeneratedValue(generator = "UUID")
    @Column(length = 36)
    private String id;

    /**
    * 地区名称
    */
    @Column(length = 100, nullable = false)
    private String name;

    /**
    * 地区短名称
    */
    @Column(length = 80)
    private String shortName;

    /**
    * 经度
    */
    @Column(precision = 20, scale = 10)
    private BigDecimal longitude;

    /*
     *纬度
     */
    @Column(precision = 20, scale = 10)
    private BigDecimal latitude;

    /**
     * 级别
     */
    @Column(precision = 4, nullable = false)
    private int level;

    /**
    * 排序
    */
    @Column(nullable = false)
    private int orderNum;

    /**
    * 邮政编码
    */
    @Column(length = 20)
    private String postCode;

    /**
     * 行政区划编码
     */
    @Column(length = 20)
    private String adCode;

    /**
     * 地址
     */
    @Column(length = 200)
    private String address;

    /**
     * 父节点ID
     */
    @Column(length = 36)
    private String parentId;
}
