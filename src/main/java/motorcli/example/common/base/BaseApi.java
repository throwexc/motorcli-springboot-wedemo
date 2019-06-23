package motorcli.example.common.base;

import com.github.pagehelper.Page;
import com.motorcli.springboot.common.dto.DataModel;
import com.motorcli.springboot.restful.MotorApiBase;
import com.motorcli.springboot.restful.dto.TreeModel;
import com.motorcli.springboot.restful.dto.converter.ListConverter;
import com.motorcli.springboot.restful.dto.converter.TreeConverter;
import com.motorcli.springboot.restful.result.ResultItems;

import java.util.List;

public class BaseApi extends MotorApiBase {

    /**
     * 分页结果
     * @param page 分页对象
     * @param xClass 转换的数据传输模型
     */
    protected <T, X extends DataModel> ResultItems<X> getPageResult(Page<T> page, Class<X> xClass) {
        List<T> list = page.getResult();
        ListConverter<T> lmc = new ListConverter<>(list);
        ResultItems<X> result = this.getResult(lmc.toList(xClass));
        result.setTotalPage(page.getPages());
        result.setTotal(page.getTotal());
        return result;
    }

    /**
     * 列表结果
     * @param list 数据集合
     * @param xClass 转换的数据传输模型
     */
    protected <T, X extends DataModel> ResultItems<X> getListResult(List<T> list, Class<X> xClass) {
        ListConverter<T> lmc = new ListConverter<>(list);
        return this.getResult(lmc.toList(xClass));
    }

    /**
     * 树形结果
     * @param list 数据集合
     * @param xClass 转换的数据传输模型
     */
    protected <T, X extends TreeModel> ResultItems<X> getTreeListResult(List<T> list, Class<X> xClass) {
        TreeConverter<T> lmc = new TreeConverter<>(list);
        return this.getResult(lmc.toTree(xClass));
    }
}
