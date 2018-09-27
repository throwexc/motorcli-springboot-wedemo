package motorcli.example.service.sys;

import motorcli.example.entity.sys.Dictionary;
import motorcli.example.dto.sys.DictionaryModel;
import motorcli.example.entity.sys.Dictionary;
import motorcli.example.entity.sys.Dictionary;

import java.util.List;

public interface DictionaryService {

    /**
     * 查询数据字典
     */
    List<Dictionary> queryAll();

    /**
     * 通过父节点ID查询数据字典
     * @param parentId 父节点ID
     */
    List<Dictionary> queryByParentId(String parentId);

    /**
     * 保存数据字典
     * @param model 保存参数
     */
    Dictionary save(DictionaryModel model);


    /**
     * 查询数据字典
     * @param key 数据字KEY
     */
    Dictionary queryByKey(String key);

    /**
     * 查询数据字典
     * @param id 数据字典ID
     */
    void deleteById(String id);
}
