package motorcli.example.service.common;

import com.mongodb.client.gridfs.model.GridFSFile;
import com.motorcli.springboot.common.exceptions.FileHandlerException;
import com.motorcli.springboot.common.utils.CollectionUtils;
import com.motorcli.springboot.common.utils.FileUtils;
import lombok.extern.slf4j.Slf4j;
import motorcli.example.dao.sys.mongodb.TempFileMongoDBDao;
import motorcli.example.entity.sys.mongodb.TempFile;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;

@Component
@Slf4j
public class FileOption {

    @Autowired
    private MongoFileOption mongoFileOption;

    @Autowired
    private TempFileMongoDBDao tempFileMongoDBDao;

    /**
     * 上传文件到 mongo db
     */
    public String upload(MultipartFile multipartFile) {
        if(multipartFile == null) {
            return null;
        }

        GridFSFile file = this.mongoFileOption.saveFile(multipartFile);

        if(file != null) {
            return file.getId().toString();
        } else {
            return null;
        }
    }

    /**
     * 上传文件到 mongo db
     */
    public String upload(File f) {
        if(f == null) {
            return null;
        }

        GridFSFile file = this.mongoFileOption.saveFile(f);

        if(file != null) {
            return file.getId().toString();
        } else {
            return null;
        }
    }

    /**
     * 上传文件到 mongo db
     */
    public List<String> upload(List<MultipartFile> fileList) {
        List<String> resultList = new ArrayList<>();

        if(CollectionUtils.isEmpty(fileList)) {
            return resultList;
        }

        for(MultipartFile multipartFile : fileList) {

            GridFSFile file = this.mongoFileOption.saveFile(multipartFile);

            if(file != null) {
                resultList.add(file.getObjectId().toString());
            }
        }

        return resultList;
    }

    /**
     * 上传文件到 mongo db
     * 并添加临时文件记录
     */
    public TempFile uploadTempFile(MultipartFile multipartFile, String userId, String alias) {
        TempFile tempFile = new TempFile();
        tempFile.setFileName(multipartFile.getOriginalFilename());
        tempFile.setAlias(alias);
        String extension = FileUtils.getExtension(multipartFile.getOriginalFilename());
        //tempFile.setMediaType(MediaType.parse(multipartFile.getOriginalFilename()).toString());

        tempFile.setCreateTime(new Date());
        tempFile.setExtension(extension);

        tempFile.setUserId(userId);

        Map<String, Object> params = new HashMap<>();
        if(!StringUtils.isEmpty(alias)) {
            List<String> aliases = new ArrayList<>();
            aliases.add(alias);
            params.put("aliases", aliases);
        }

        GridFSFile gridFSFile = this.mongoFileOption.saveFile(multipartFile);
        tempFile.setFileId(gridFSFile.getObjectId().toString());

        return this.tempFileMongoDBDao.save(tempFile);
    }

    /**
     * 上传文件到 mongo db
     * 并添加临时文件记录
     */
    public TempFile uploadTempFile(File file, String orgName, String userId, String alias) {
        TempFile tempFile = new TempFile();
        tempFile.setFileName(orgName);
        tempFile.setAlias(alias);
        String extension = FileUtils.getExtension(orgName);
        //tempFile.setMediaType(MediaType.parse(orgName).toString());
        tempFile.setCreateTime(new Date());
        tempFile.setExtension(extension);

        tempFile.setUserId(userId);

        Map<String, Object> params = new HashMap<>();
        if(!StringUtils.isEmpty(alias)) {
            List<String> aliases = new ArrayList<>();
            aliases.add(alias);
            params.put("aliases", aliases);
        }

        this.mongoFileOption.saveFile(file);

        return this.tempFileMongoDBDao.save(tempFile);
    }

    /**
     * 删除临时文件
     * @param id 临时文件记录ID
     * @param  isDeleteFile 是否删除 mongo db 文件
     */
    public void deleteTempFile(String id, Boolean isDeleteFile) {
        TempFile tempFile = this.tempFileMongoDBDao.findById(id);
        if(tempFile != null) {
            if(isDeleteFile != null && isDeleteFile == true) {
                try {
                    this.mongoFileOption.deleteMongoFile(tempFile.getFileId());
                } catch (IOException e) {
                    throw new FileHandlerException("从 Mongo DB 中删除文件失败, file id is -> [" + tempFile.getFileId() + "]");
                }
            }
            this.tempFileMongoDBDao.delete(id);
        }
    }

    public void deleteTempFileByFileId(String fileId, Boolean isDeleteFile) {
        TempFile tempFile = this.tempFileMongoDBDao.findByFileId(fileId);
        if(tempFile != null) {
            this.tempFileMongoDBDao.delete(tempFile);
        }
        if(isDeleteFile != null && isDeleteFile == true) {
            try {
                this.mongoFileOption.deleteMongoFile(fileId);
            } catch (IOException e) {
                throw new FileHandlerException("从 Mongo DB 中删除文件失败, file id is -> [" + fileId + "]");
            }
        }
    }

    /**
     * 从 mongo db 中删除文件
     * @param fileId 文件ID
     * @param isDeleteTempFile 是否删除临时文件
     */
    public void deleteFile(String fileId, Boolean isDeleteTempFile)  {
        if(isDeleteTempFile != null && isDeleteTempFile == true) {
            TempFile tempFile = this.tempFileMongoDBDao.findByFileId(fileId);
            if(tempFile != null) {
                this.deleteTempFile(tempFile.getId(), true);
            } else {
                try {
                    this.mongoFileOption.deleteMongoFile(fileId);
                } catch (IOException e) {
                    throw new FileHandlerException("从 Mongo DB 中删除文件失败, file id is -> [" + fileId + "]");
                }
            }
        } else {
            try {
                this.mongoFileOption.deleteMongoFile(fileId);
            } catch (IOException e) {
                throw new FileHandlerException("从 Mongo DB 中删除文件失败, file id is -> [" + fileId + "]");
            }
        }
    }

    /**
     * 从 mongo db 中删除文件
     * @param fileId 文件ID
     */
    public void deleteFile(String fileId) {
        this.deleteFile(fileId, true);
    }

    public GridFSFile readFileById(String id) {
        GridFSFile file = null;
        try {
            file = this.mongoFileOption.readFileByFileId(id);
            return file;
        } catch (IOException e) {
            log.error("读取文件失败", e);
            return file;
        }
    }
}
