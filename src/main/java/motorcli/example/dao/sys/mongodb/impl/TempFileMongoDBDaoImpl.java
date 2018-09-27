package motorcli.example.dao.sys.mongodb.impl;

import motorcli.example.dao.sys.mongodb.TempFileMongoDBDao;
import motorcli.example.entity.sys.mongodb.TempFile;
import com.motorcli.springboot.common.utils.CollectionUtils;
import motorcli.example.dao.sys.mongodb.TempFileMongoDBDao;
import motorcli.example.entity.sys.mongodb.TempFile;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public class TempFileMongoDBDaoImpl implements TempFileMongoDBDao {

    @Autowired
    private MongoTemplate mongoTemplate;

    private final String collectionName = "TempFile";

    @Override
    public TempFile findById(String id) {
        return this.mongoTemplate.findById(id, TempFile.class);
    }

    @Override
    public TempFile findByFileId(String fileId) {
        Query query = new Query();

        query.addCriteria(Criteria.where("fileId").is(fileId));

        List<TempFile> files = this.mongoTemplate.find(query, TempFile.class);

        if(CollectionUtils.isEmpty(files)) {
            return null;
        }
        return files.get(0);
    }

    @Override
    public TempFile save(TempFile tempFile) {
        if(StringUtils.isEmpty(tempFile.getId())) {
            tempFile.setId(UUID.randomUUID().toString());
        }
        this.mongoTemplate.save(tempFile, this.collectionName);
        return tempFile;
    }

    @Override
    public void delete(String id) {
        TempFile tempFile = this.findById(id);
        this.delete(tempFile);
    }

    @Override
    public void delete(TempFile tempFile) {
        if(tempFile != null) {
            this.mongoTemplate.remove(tempFile, this.collectionName);
        }
    }
}
