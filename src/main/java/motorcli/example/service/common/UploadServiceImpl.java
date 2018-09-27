package motorcli.example.service.common;

import motorcli.example.entity.sys.mongodb.TempFile;
import motorcli.example.entity.sys.mongodb.TempFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
public class UploadServiceImpl implements UploadService {

    @Autowired
    private FileOption fileOption;

    @Override
    public String upload(MultipartFile multipartFile) {
        return this.fileOption.upload(multipartFile);
    }

    @Override
    public String upload(File file) {
        return this.fileOption.upload(file);
    }

    @Override
    public List<String> upload(List<MultipartFile> fileList) {
        return this.fileOption.upload(fileList);
    }

    @Override
    public TempFile uploadTempFile(MultipartFile multipartFile, String userId, String alias) {
        return this.fileOption.uploadTempFile(multipartFile, userId, alias);
    }

    @Override
    public TempFile uploadTempFile(File file, String orgName, String userId, String alias) {
        return this.fileOption.uploadTempFile(file, orgName, userId, alias);
    }

    @Override
    public void deleteTempFile(String id, Boolean isDeleteFile) {
       this.fileOption.deleteTempFile(id, isDeleteFile);
    }

    @Override
    public void deleteFile(String fileId) {
        this.fileOption.deleteFile(fileId, true);
    }

    @Override
    public List<MultipartFile> getFiles(HttpServletRequest request) {
        List<MultipartFile> files = new ArrayList<>();
        //创建一个通用的多部分解析器
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver(request.getSession().getServletContext());
        //判断 request 是否有文件上传,即多部分请求
        if(multipartResolver.isMultipart(request)){
            //转换成多部分request
            MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest)request;
            //取得request中的所有文件名
            Iterator<String> iterator = multiRequest.getFileNames();
            while(iterator.hasNext()){
                //取得上传文件
                MultipartFile file = multiRequest.getFile(iterator.next());
                if(file != null){
                    files.add(file);
                }
            }
        }
        return files;
    }
}
