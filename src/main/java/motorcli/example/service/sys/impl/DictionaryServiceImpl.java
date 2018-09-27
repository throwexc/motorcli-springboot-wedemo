package motorcli.example.service.sys.impl;

import motorcli.example.dto.sys.DictionaryModel;
import motorcli.example.entity.sys.Dictionary;
import motorcli.example.mapper.sys.DictionaryMapper;
import motorcli.example.service.sys.DictionaryService;
import com.motorcli.springboot.common.utils.CollectionUtils;
import motorcli.example.dto.sys.DictionaryModel;
import motorcli.example.entity.sys.Dictionary;
import motorcli.example.exceptions.DataRepeatException;
import motorcli.example.exceptions.ExistChildCanNotDeleteException;
import motorcli.example.exceptions.NotAffectedDataException;
import motorcli.example.mapper.sys.DictionaryMapper;
import motorcli.example.service.sys.DictionaryService;
import motorcli.example.dto.sys.DictionaryModel;
import motorcli.example.entity.sys.Dictionary;
import motorcli.example.mapper.sys.DictionaryMapper;
import motorcli.example.service.sys.DictionaryService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DictionaryServiceImpl implements DictionaryService {

    @Autowired
    private DictionaryMapper dictionaryMapper;

    @Override
    public List<Dictionary> queryAll() {
        return this.dictionaryMapper.queryAll();
    }

    @Override
    public List<Dictionary> queryByParentId(String parentId) {
        return this.dictionaryMapper.queryByParentId(parentId);
    }

    @Override
    public Dictionary save(DictionaryModel model) {
        Dictionary dictionary;
        Dictionary dictionaryKeyCheck = this.dictionaryMapper.queryByKey(model.getKey());

        if(!StringUtils.isEmpty(model.getId())) {
            dictionary = this.dictionaryMapper.queryById(model.getId());
            if(dictionaryKeyCheck != null && !dictionaryKeyCheck.getId().equals(dictionary.getId())) {
                throw new DataRepeatException("数据字典键值", model.getKey());
            }
        } else {
            if(dictionaryKeyCheck != null) {
                throw  new DataRepeatException("数据字典键值", model.getKey());
            }
            dictionary = new Dictionary();
        }

        if(!StringUtils.isEmpty(model.getParentId())) {
            dictionary.setParentId(model.getParentId());
        }

        dictionary.setKey(model.getKey());
        dictionary.setValue(model.getValue());
        dictionary.setOrderNum(model.getOrderNum());
        dictionary.setLabel(model.getLabel());

        int saveFlag;

        if(StringUtils.isEmpty(dictionary.getId())) {
            dictionary.setId(UUID.randomUUID().toString());
            saveFlag = this.dictionaryMapper.insert(dictionary);
        } else {
            saveFlag = this.dictionaryMapper.updateByPrimaryKey(dictionary);
        }

        if(saveFlag <= 0) {
            throw new NotAffectedDataException();
        }

        return dictionary;
    }

    @Override
    public Dictionary queryByKey(String key) {
        return this.dictionaryMapper.queryByKey(key);
    }

    @Override
    public void deleteById(String id) {
        List<Dictionary> list = this.dictionaryMapper.queryByParentId(id);

        if(!CollectionUtils.isEmpty(list)) {
            throw new ExistChildCanNotDeleteException();
        }

        this.dictionaryMapper.deleteByPrimaryKey(id);
    }
}
