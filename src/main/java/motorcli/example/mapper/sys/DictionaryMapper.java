package motorcli.example.mapper.sys;

import motorcli.example.entity.sys.Dictionary;
import motorcli.example.entity.sys.Dictionary;
import motorcli.example.entity.sys.Dictionary;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;

public interface DictionaryMapper extends Mapper<Dictionary> {

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
     * 查询数据字典
     * @param id 数据字典ID
     */
    Dictionary queryById(String id);

    /**
     * 查询数据字典
     * @param key 数据字KEY
     */
    Dictionary queryByKey(String key);
}
