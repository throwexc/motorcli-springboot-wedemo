package motorcli.example.dao.sys.mongodb;

import motorcli.example.entity.sys.mongodb.TempFile;
import motorcli.example.entity.sys.mongodb.TempFile;

public interface TempFileMongoDBDao {

    /**
     * 查询临时文件
     * @param id 临时文件ID
     * @return 临时文件对象
     */
    TempFile findById(String id);

    /**
     * 查询临时文件
     * @param fileId 文件ID
     * @return 临时文件对象
     */
    TempFile findByFileId(String fileId);

    /**
     * 保存临时文件
     * @param tempFile 临时文件对象
     */
    TempFile save(TempFile tempFile);

    /**
     * 删除临时文件
     * @param id 临时文件ID
     */
    void delete(String id);

    /**
     * 删除临时文件
     * @param tempFile 临时文件对象
     */
    void delete(TempFile tempFile);
}
