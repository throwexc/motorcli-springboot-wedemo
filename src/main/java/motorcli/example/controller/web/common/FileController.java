package motorcli.example.controller.web.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.gridfs.model.GridFSFile;
import com.motorcli.springboot.common.exceptions.FileHandlerException;
import com.motorcli.springboot.common.utils.FileUtils;
import com.motorcli.springboot.common.utils.JsonUtils;
import com.motorcli.springboot.mongodb.config.gridfs.MongoDBFileManager;
import com.motorcli.springboot.web.view.FileView;
import lombok.extern.slf4j.Slf4j;
import motorcli.example.common.annotation.NoCheckSession;
import motorcli.example.common.base.BaseApi;
import motorcli.example.entity.sys.mongodb.TempFile;
import motorcli.example.service.common.UploadService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * 文件WEB交互
 */
@Controller
@Scope("prototype")
@RequestMapping("/common/file")
@Slf4j
public class FileController extends BaseApi {

    @Autowired
    private UploadService uploadService;

    @Autowired
    private MongoDBFileManager mongoDBFileManager;

    @Autowired
    private ObjectMapper objectMapper;

    @RequestMapping("/download/{id}")
    @NoCheckSession
    public FileView download(@PathVariable String id) {

        if(id.indexOf(".") != -1) {
            id = FileUtils.getFileName(id);
        }

        try {
            ObjectId objectId = new ObjectId(id);
            GridFSFile gridFSFile = this.mongoDBFileManager.get(objectId);
            if(gridFSFile == null) {
                throw new FileHandlerException("没有找到文件 [ " + id + " ]");
            }

            GridFsResource resource = this.mongoDBFileManager.getResource(gridFSFile.getFilename());

            if(resource == null) {
                throw new FileHandlerException("没有找到文件 [ " + id + " ]");
            }

            //String fileName = "文件下载" + resource.getContentType();

            String fileName = resource.getFilename();

            fileName = fileName.trim().replaceAll("\\s*", "");

            return new FileView(resource.getInputStream(), fileName);
        } catch (IOException e) {
            throw new FileHandlerException("读取文件失败", e);
        }
    }

    @RequestMapping(value = "/upload/temp/file", method = RequestMethod.POST)
    @ResponseBody
    @NoCheckSession
    public String uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam String userId,
            @RequestParam(required = false) String alias) {

        TempFile tempFile = this.uploadService.uploadTempFile(file, userId, alias);

        ModelMap result = new ModelMap();

        ModelMap modelMap = new ModelMap();
        modelMap.put("id", tempFile.getId());
        modelMap.put("fileName", tempFile.getFileName());
        modelMap.put("alias", tempFile.getAlias());
        modelMap.put("mediaType", tempFile.getMediaType());
        modelMap.put("extension", tempFile.getExtension());
        modelMap.put("location", "common/file/download/" + tempFile.getFileId());
        modelMap.put("fileId", tempFile.getFileId());
        modelMap.put("entityId", tempFile.getEntityId());


        result.put("code", 1);
        result.put("record", modelMap);
        result.put("success", true);
        return JsonUtils.toJson(this.objectMapper, result, false);
    }

    @RequestMapping(value = "/upload/temp/file/delete", method = RequestMethod.GET)
    @ResponseBody
    public ModelMap uploadTemp(@RequestParam String id, @RequestParam(required = false) Boolean isDeleteFile) throws IOException {
        if(isDeleteFile == null) {
            isDeleteFile = true;
        }
        this.uploadService.deleteTempFile(id, isDeleteFile);
        ModelMap result = new ModelMap();
        result.put("code", 1);
        return result;
    }

    @RequestMapping(value = "/delete/{fileId}", method = RequestMethod.DELETE)
    @ResponseBody
    public ModelMap deleteFile(@PathVariable String fileId) {
        this.uploadService.deleteFile(fileId);

        ModelMap result = new ModelMap();
        result.put("code", 1);
        return result;
    }
}
