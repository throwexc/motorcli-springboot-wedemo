package motorcli.example.controller.api.sys;

import motorcli.example.entity.sys.Dictionary;
import motorcli.example.service.sys.DictionaryService;
import com.motorcli.springboot.common.utils.CollectionUtils;
import com.motorcli.springboot.restfull.result.Result;
import com.motorcli.springboot.restfull.result.ResultItems;
import com.motorcli.springboot.restfull.result.ResultRecord;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import motorcli.example.common.base.BaseApi;
import motorcli.example.dto.sys.DictionaryModel;
import motorcli.example.entity.sys.Dictionary;
import motorcli.example.service.sys.DictionaryService;
import motorcli.example.entity.sys.Dictionary;
import motorcli.example.service.sys.DictionaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/sys/dictionary")
@Api(value = "数据字典")
public class DictionaryApi extends BaseApi {

    @Autowired
    private DictionaryService dictionaryService;

    @RequestMapping(value = "/tree", method = RequestMethod.GET)
    @ApiOperation(value="查询数据字典")
    public ResultItems<DictionaryModel> tree() {
        List<Dictionary> list = this.dictionaryService.queryAll();
        return this.getTreeListResult(list, DictionaryModel.class);
    }

    @RequestMapping(value = "/save", method = RequestMethod.POST)
    @ApiOperation(value="保存数据字典")
    public ResultRecord<DictionaryModel> save(@RequestBody DictionaryModel dictionaryDto) {
        Dictionary dictionary = this.dictionaryService.save(dictionaryDto);
        return this.getResult(new DictionaryModel(dictionary));
    }

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
    @ApiOperation(value="删除数据字典")
    public Result delete(@PathVariable String id) {
        this.dictionaryService.deleteById(id);
        return this.getResult();
    }

    @RequestMapping(value = "/key/{key}", method = RequestMethod.GET)
    @ApiOperation(value="查询数据字典", notes = "通过KEY查询")
    public ResultRecord<DictionaryModel> queryByKey(@PathVariable String key) {
        Dictionary dictionary = this.dictionaryService.queryByKey(key);
        return this.getResult(new DictionaryModel(dictionary));
    }

    @RequestMapping(value = "/key/{key}/tree", method = RequestMethod.GET)
    @ApiOperation(value="查询数据字典", notes = "通过KEY查询, 并封装成树形数据")
    public ResultItems<DictionaryModel> queryByKeyToTree(@PathVariable String key) {
        Dictionary dictionary = this.dictionaryService.queryByKey(key);
        List<Dictionary> list = this.findAllChildren(dictionary);
        return this.getTreeListResult(list, DictionaryModel.class);
    }

    @RequestMapping(value = "/parent/key/{key}", method = RequestMethod.GET)
    @ApiOperation(value="查询数据字典", notes = "查询父节点下子节点数据")
    public ResultItems<DictionaryModel> queryByParentKey(@PathVariable String key) {
        Dictionary dictionary = this.dictionaryService.queryByKey(key);
        List<Dictionary> list = this.dictionaryService.queryByParentId(dictionary.getId());
        return this.getListResult(list, DictionaryModel.class);
    }

    /**
     * 递归获取所有子节点
     */
    private List<Dictionary> findAllChildren(Dictionary dictionary) {
        List<Dictionary> list = new ArrayList<>();
        list.add(dictionary);

        List<Dictionary> children = this.dictionaryService.queryByParentId(dictionary.getId());

        if(!CollectionUtils.isEmpty(children)) {
            for(Dictionary child : children) {
                list.addAll(this.findAllChildren(child));
            }
        }
        return list;
    }
}
