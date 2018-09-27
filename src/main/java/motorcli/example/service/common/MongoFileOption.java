package motorcli.example.service.common;

import com.mongodb.client.gridfs.model.GridFSFile;
import com.motorcli.springboot.mongodb.config.gridfs.MongoDBFileManager;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Component
@Slf4j
public class MongoFileOption {

    @Autowired
    private MongoDBFileManager mongoDBFileManager;

    public GridFSFile saveFile(MultipartFile multipartFile) {
        try {
            ObjectId objectId = this.mongoDBFileManager.save(multipartFile.getInputStream(), multipartFile.getOriginalFilename());
            // Mongo 文件上传加固
            GridFSFile file = this.mongoDBFileManager.get(objectId);
            if(file == null) {
                objectId = this.mongoDBFileManager.save(multipartFile.getInputStream(), multipartFile.getOriginalFilename());
                return this.mongoFileCheck(objectId);
            }
            return file;
        } catch (IOException ex) {
            log.error("File save to Mongo DB Error", ex);
            return  null;
        }
    }

    public GridFSFile saveFile(File file) {
        try {
            ObjectId objectId = this.mongoDBFileManager.save(file);
            // Mongo 文件上传加固
            GridFSFile gridFSFile = this.mongoFileCheck(objectId);
            if(file == null) {
                objectId = this.mongoDBFileManager.save(file);
                return this.mongoFileCheck(objectId);
            }
            return gridFSFile;
        } catch (IOException ex) {
            log.error("File save to Mongo DB Error", ex);
            return  null;
        }
    }

    /**
     * 删除 mongodb 文件
     */
    public void deleteMongoFile(String fileId) throws IOException {
        ObjectId id = new ObjectId(fileId);
        GridFSFile mongoFile = this.mongoDBFileManager.get(id);
        if(mongoFile != null) {
            this.mongoDBFileManager.delete(id);
            mongoFile = this.mongoDBFileManager.get(id);
            if(mongoFile != null) {
                this.mongoDBFileManager.delete(id);
            }
        }
    }

    /**
     * 读取文件
     * @param fileId 文件ID
     * @throws IOException
     */
    public GridFSFile readFileByFileId(String fileId) throws IOException {
        ObjectId id = new ObjectId(fileId);
        GridFSFile mongoFile = this.mongoDBFileManager.get(id);
        return mongoFile;
    }

    private GridFSFile mongoFileCheck(ObjectId fileId) throws IOException {
        GridFSFile file = this.mongoDBFileManager.get(fileId);
        if(file != null) {
            return file;
        } else {
            return null;
        }
    }
}
