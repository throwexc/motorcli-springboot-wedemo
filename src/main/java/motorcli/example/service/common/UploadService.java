package motorcli.example.service.common;

import motorcli.example.entity.sys.mongodb.TempFile;
import motorcli.example.entity.sys.mongodb.TempFile;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.util.List;

/**
 * 上传业务逻辑
 */
public interface UploadService {

    /**
     * 上传文件
     * @return 文件ID
     */
    String upload(MultipartFile multipartFile);

    /**
     * 上传文件
     * @param file 文件
     */
    String upload(File file);

    /**
     * 上传文件
     * @param fileList 文件列表
     * @return 返回成功文件记录ID集合
     */
    List<String> upload(List<MultipartFile> fileList);

    /**
     * 上传临时文件
     * @param multipartFile 文件
     * @param userId 上传用户ID
     * @param alias 文件别名
     * @return 临时文件对象
     */
    TempFile uploadTempFile(MultipartFile multipartFile, String userId, String alias);

    /**
     * 上传临时文件
     * @param file 文件
     * @param userId 上传用户ID
     * @param orgName 原文件名
     * @param alias 文件别名
     * @return 临时文件对象
     */
    TempFile uploadTempFile(File file, String orgName, String userId, String alias);

    /**
     * 删除临时文件
     * @param id 临时文件记录ID
     * @param isDeleteFile 是否删除文件
     */
    void deleteTempFile(String id, Boolean isDeleteFile);


    /**
     * 获取  request 中的文件集合
     */
    List<MultipartFile> getFiles(HttpServletRequest request);

    /**
     * 删除文件
     * @param fileId 文件ID
     */
    void deleteFile(String fileId);
}
