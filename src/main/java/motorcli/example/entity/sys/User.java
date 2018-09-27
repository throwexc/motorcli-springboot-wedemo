package motorcli.example.entity.sys;


import lombok.Getter;
import lombok.Setter;
import motorcli.example.emnus.common.DataState;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

/**
 * 用户实体
 */
@Entity
@Getter
@Setter
@Table(name = "t_sys_user")
public class User {

    @Id
    private String id;

    /**
     * 用户名
     */
    @Column(length = 50, nullable = false)
    private String username;

    /**
     * 密码
     */
    @Column(length = 150, nullable = false)
    private String password;

    /**
     * 状态
     */
    @Column(precision = 4, nullable = false)
    private int dataState = DataState.ENABLE.code();

    /**
     * 性别
     */
    @Column(length = 2, nullable = false)
    private String sex;

    /**
     * 电话
     */
    @Column(length = 20)
    private String phone;

    /**
     * 电子邮件
     */
    @Column(length = 80)
    private String email;

    /**
     * 出生时间
     */
    private Date birthday;

    /**
     * 头像图片地址
     */
    @Column(length = 200)
    private String headImgUrl;

    /**
     * 有效时间
     */
    private Date activeTime;

    /**
     * 单位ID
     */
    @Column(length = 36)
    private String unitId;

    /**
     * 创建时间
     */
    @Column(nullable = false)
    private Date createTime;

    /**
     * 更新时间
     */
    @Column(nullable = false)
    private Date updateTime;

    /**
     * 扮演者信息
     */
    @Transient
    private Actor actor;

    /**
     * 部门信息
     */
    @Transient
    private Unit unit;

    /**
     * 角色信息
     */
    @Transient
    private List<Role> roles;
}
