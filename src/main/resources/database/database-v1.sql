-- 部门表
CREATE TABLE `t_sys_unit` (
  `id` varchar(36) NOT NULL COMMENT 'ID',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `name` varchar(50) NOT NULL COMMENT '部门名称',
  `order_num` int(11) NOT NULL COMMENT '排序号',
  `remark` varchar(200) DEFAULT NULL COMMENT '备注',
  `data_state` int(4) NOT NULL COMMENT '数据状态',
  `unit_type` int(4) NOT NULL COMMENT '部门类型',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `parent_id` varchar(36) DEFAULT NULL COMMENT '父节点ID',
  PRIMARY KEY (`id`),
  KEY `FK_UNIT_PARENT_ID` (`parent_id`),
  CONSTRAINT `FK_UNIT_PARENT_ID` FOREIGN KEY (`parent_id`) REFERENCES `t_sys_unit` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='部门表';

-- 系统资源表
CREATE TABLE `t_sys_resource` (
  `id` varchar(36) NOT NULL COMMENT 'ID',
  `name` varchar(50) NOT NULL COMMENT '资源名称',
  `order_num` bigint(20) NOT NULL COMMENT '排序号',
  `resource_type` int(4) NOT NULL COMMENT '资源类型',
  `data_state` int(4) NOT NULL COMMENT '数据状态',
  `description` varchar(200) DEFAULT NULL COMMENT '描述',
  `parent_id` varchar(36) DEFAULT NULL COMMENT '父节点ID',
  PRIMARY KEY (`id`),
  KEY `FK_RESOURCE_PARENT_ID` (`parent_id`),
  CONSTRAINT `FK_RESOURCE_PARENT_ID` FOREIGN KEY (`parent_id`) REFERENCES `t_sys_resource` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='系统资源表';

-- 系统模块表
CREATE TABLE `t_sys_module` (
  `id` varchar(36) NOT NULL COMMENT 'ID',
  `module_url` varchar(300) NOT NULL COMMENT '链接地址',
  `module_icon` varchar(120) DEFAULT NULL COMMENT '图标',
  PRIMARY KEY (`id`),
  CONSTRAINT `FK_MODULE_ID` FOREIGN KEY (`id`) REFERENCES `t_sys_resource` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='系统模块表';

-- 系统扮演者表
CREATE TABLE `t_sys_actor` (
  `id` varchar(36) NOT NULL COMMENT 'ID',
  `acl_type` int(4) NOT NULL COMMENT '授权类型',
  `actor_type` int(4) NOT NULL COMMENT '扮演者类型',
  `name` varchar(50) NOT NULL COMMENT '扮演者名称',
  `remark` varchar(200) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='系统扮演者表';

-- 访问控制列表
CREATE TABLE `t_sys_acl` (
  `id` varchar(36) CHARACTER SET utf8 NOT NULL COMMENT 'ID',
  `actor_id` varchar(36) NOT NULL COMMENT '扮演者ID',
  `resource_id` varchar(36) NOT NULL COMMENT '资源ID',
  `permission` int(6) NOT NULL COMMENT '权限',
  PRIMARY KEY (`id`),
  KEY `FK_ACL_ACTOR_ID` (`actor_id`),
  KEY `FK_ACL_RESOURCE_ID` (`resource_id`),
  CONSTRAINT `FK_ACL_ACTOR_ID` FOREIGN KEY (`actor_id`) REFERENCES `t_sys_actor` (`id`),
  CONSTRAINT `FK_ACL_RESOURCE_ID` FOREIGN KEY (`resource_id`) REFERENCES `t_sys_resource` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='访问控制列表';

-- 地区表
CREATE TABLE `t_sys_area` (
  `id` varchar(36) NOT NULL COMMENT 'ID',
  `name` varchar(100) NOT NULL COMMENT '地区名称',
  `short_name` varchar(80) NOT NULL COMMENT '地区短名称',
  `ad_code` varchar(20) DEFAULT NULL COMMENT '行政区划编码',
  `post_code` varchar(20) DEFAULT NULL COMMENT '邮政编码',
  `level` int(4) NOT NULL COMMENT '级别',
  `order_num` int(11) NOT NULL COMMENT '排序号',
  `latitude` decimal(20,10) DEFAULT NULL COMMENT '纬度',
  `longitude` decimal(20,10) DEFAULT NULL COMMENT '经度',
  `address` varchar(200) DEFAULT NULL COMMENT '地址',
  `parent_id` varchar(36) DEFAULT NULL COMMENT '父节点ID',
  PRIMARY KEY (`id`),
  KEY `FK_AREA_PARENT_ID` (`parent_id`),
  CONSTRAINT `FK_AREA_PARENT_ID` FOREIGN KEY (`parent_id`) REFERENCES `t_sys_area` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='地区表';

-- 角色表
CREATE TABLE `t_sys_role` (
  `id` varchar(36) NOT NULL COMMENT 'ID',
  PRIMARY KEY (`id`),
  CONSTRAINT `FK_ROLE_ID` FOREIGN KEY (`id`) REFERENCES `t_sys_actor` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='角色表';

-- 用户表
CREATE TABLE `t_sys_user` (
  `id` varchar(36) NOT NULL COMMENT 'ID',
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(150) NOT NULL COMMENT '密码',
  `data_state` int(4) NOT NULL COMMENT '数据状态',
  `sex` varchar(2) NOT NULL COMMENT '性别',
  `phone` varchar(20) DEFAULT NULL COMMENT '联系电话',
  `email` varchar(80) DEFAULT NULL COMMENT '电子邮件',
  `birthday` datetime DEFAULT NULL COMMENT '生日',
  `head_img_url` varchar(200) DEFAULT NULL COMMENT '头像图片地址',
  `active_time` datetime DEFAULT NULL COMMENT '有效时间',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `unit_id` varchar(36) DEFAULT NULL COMMENT '部门ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_USER_USERNAME` (`username`),
  KEY `FK_USER_UNIT_ID` (`unit_id`),
  CONSTRAINT `FK_USER_UNIT_ID` FOREIGN KEY (`unit_id`) REFERENCES `t_sys_unit` (`id`),
  CONSTRAINT `FK_USER_ID` FOREIGN KEY (`id`) REFERENCES `t_sys_actor` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户表';

-- 角色用户关联表
CREATE TABLE `t_sys_role_user` (
  `user_id` varchar(36) NOT NULL COMMENT '用户ID',
  `role_id` varchar(36) NOT NULL COMMENT '角色ID',
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `FK_ROLE_USER_ROLE_ID` (`role_id`),
  CONSTRAINT `FK_ROLE_USER_USER_ID` FOREIGN KEY (`user_id`) REFERENCES `t_sys_user` (`id`),
  CONSTRAINT `FK_ROLE_USER_ROLE_ID` FOREIGN KEY (`role_id`) REFERENCES `t_sys_role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='角色用户关联表';

-- 数据字典表
CREATE TABLE `t_sys_dictionary` (
  `id` varchar(36) NOT NULL COMMENT 'ID',
  `d_key` varchar(200) NOT NULL COMMENT '字典键值',
  `d_label` varchar(200) NOT NULL COMMENT '字典显示值',
  `d_value` varchar(300) NOT NULL COMMENT '字典存储值',
  `order_num` int(11) NOT NULL COMMENT '排序号',
  `parent_id` varchar(36) DEFAULT NULL COMMENT '父节点ID',
  PRIMARY KEY (`id`),
  KEY `FK_DICTIONARY_PARENT_ID` (`parent_id`),
  CONSTRAINT `FK_DICTIONARY_PARENT_ID` FOREIGN KEY (`parent_id`) REFERENCES `t_sys_dictionary` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='数据字典表';


-- 系统资源数据
INSERT INTO `t_sys_resource`(`id`, `name`, `order_num`, `resource_type`, `data_state`, `description`, `parent_id`) VALUES ('b3b7569a-2e0e-4b76-a0c2-9cca560fd00a', '系统运维', 99, 1, 1, NULL, NULL);
INSERT INTO `t_sys_resource`(`id`, `name`, `order_num`, `resource_type`, `data_state`, `description`, `parent_id`) VALUES ('25bbbb40-f0cf-42d8-a614-9bfb8409fa3b', '开发人员', 9999, 1, 1, '开发人员菜单', 'b3b7569a-2e0e-4b76-a0c2-9cca560fd00a');
INSERT INTO `t_sys_resource`(`id`, `name`, `order_num`, `resource_type`, `data_state`, `description`, `parent_id`) VALUES ('7da84fa5-a4f1-4bb1-ae9e-e2774a917778', '模块管理', 999901, 1, 1, '模块管理', '25bbbb40-f0cf-42d8-a614-9bfb8409fa3b');
INSERT INTO `t_sys_resource`(`id`, `name`, `order_num`, `resource_type`, `data_state`, `description`, `parent_id`) VALUES ('153ac3f2-35c1-4eec-b3ef-c8d8df4a67d8', '数据字典', 999902, 1, 1, '数据字典', '25bbbb40-f0cf-42d8-a614-9bfb8409fa3b');
INSERT INTO `t_sys_resource`(`id`, `name`, `order_num`, `resource_type`, `data_state`, `description`, `parent_id`) VALUES ('19d400dc-b753-41d9-af96-b3d1ce0a787c', '系统设置', 9998, 1, 1, NULL, 'b3b7569a-2e0e-4b76-a0c2-9cca560fd00a');
INSERT INTO `t_sys_resource`(`id`, `name`, `order_num`, `resource_type`, `data_state`, `description`, `parent_id`) VALUES ('ac5e1dad-81aa-4a18-9f5f-1a7523059c68', '角色管理', 999801, 1, 1, NULL, '19d400dc-b753-41d9-af96-b3d1ce0a787c');
INSERT INTO `t_sys_resource`(`id`, `name`, `order_num`, `resource_type`, `data_state`, `description`, `parent_id`) VALUES ('6a403dc6-c83e-4ace-8093-7a1d3a56b91e', '用户管理', 999802, 1, 1, NULL, '19d400dc-b753-41d9-af96-b3d1ce0a787c');

-- 模块数据
INSERT INTO `t_sys_module`(`id`, `module_url`, `module_icon`) VALUES ('b3b7569a-2e0e-4b76-a0c2-9cca560fd00a', 'sys', 'images/main/menu/icon01.png');
INSERT INTO `t_sys_module`(`id`, `module_url`, `module_icon`) VALUES ('25bbbb40-f0cf-42d8-a614-9bfb8409fa3b', 'sys/developer', NULL);
INSERT INTO `t_sys_module`(`id`, `module_url`, `module_icon`) VALUES ('7da84fa5-a4f1-4bb1-ae9e-e2774a917778', 'sys/developer/Module', NULL);
INSERT INTO `t_sys_module`(`id`, `module_url`, `module_icon`) VALUES ('153ac3f2-35c1-4eec-b3ef-c8d8df4a67d8', 'sys/developer/Dictionary', NULL);
INSERT INTO `t_sys_module`(`id`, `module_url`, `module_icon`) VALUES ('19d400dc-b753-41d9-af96-b3d1ce0a787c', 'sys/setting', NULL);
INSERT INTO `t_sys_module`(`id`, `module_url`, `module_icon`) VALUES ('ac5e1dad-81aa-4a18-9f5f-1a7523059c68', 'sys/setting/Role', NULL);
INSERT INTO `t_sys_module`(`id`, `module_url`, `module_icon`) VALUES ('6a403dc6-c83e-4ace-8093-7a1d3a56b91e', 'sys/setting/User', NULL);

-- 部门数据
INSERT INTO `t_sys_unit`(`id`, `create_time`, `name`, `order_num`, `remark`, `data_state`, `unit_type`, `update_time`, `parent_id`) VALUES ('212fa32e-acba-4bd4-a73a-a9465b7ed9df', '2018-09-22 15:09:06', '测试单位', 1, NULL, 1, 1, '2018-09-22 15:09:29', NULL);

-- 扮演者数据
INSERT INTO `t_sys_actor`(`id`, `acl_type`, `actor_type`, `name`, `remark`) VALUES ('8fb81d2c-0ddc-11e7-93ae-92361f002671', 0, -1, '系统管理员', '系统管理员');

-- 用户数据
INSERT INTO `t_sys_user`(`id`, `username`, `password`, `data_state`, `sex`, `phone`, `email`, `birthday`, `head_img_url`, `active_time`, `create_time`, `update_time`, `unit_id`) VALUES ('8fb81d2c-0ddc-11e7-93ae-92361f002671', 'admin', '21232f297a57a5a743894a0e4a801fc3', 1, '男', '13614712590', '306760249@qq.com', '2018-09-16 16:24:34', NULL, NULL, '2018-09-16 16:24:45', '2018-09-16 16:24:48', NULL);