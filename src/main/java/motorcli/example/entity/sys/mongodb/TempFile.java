package motorcli.example.entity.sys.mongodb;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class TempFile {

    /**
     * ID
     */
    private String id;

    /**
     * 文件名称
     */
    private String fileName;

    /**
     * 文件别名
     */
    private String alias;

    /**
     * 文件类型
     */
    private String mediaType;

    /**
     * 扩展名
     */
    private String extension;

    /**
     * 文件ID
     */
    private String fileId;

    /**
     * 实体对象ID
     */
    private String entityId;

    /**
     * 用户ID
     */
    private String userId;

    /**
     * 创建时间
     */
    private Date createTime;
}
