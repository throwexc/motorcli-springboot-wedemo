package motorcli.example.common.base;

import com.github.pagehelper.Page;
import com.motorcli.springboot.restfull.MotorApiBase;
import com.motorcli.springboot.restfull.dto.EntityDataModel;
import com.motorcli.springboot.restfull.dto.TreeEntityDataModel;
import com.motorcli.springboot.restfull.dto.converter.ListConverter;
import com.motorcli.springboot.restfull.dto.converter.TreeConverter;
import com.motorcli.springboot.restfull.result.ResultItems;

import java.util.List;

public class BaseApi extends MotorApiBase {

    /**
     * 分页结果
     * @param page 分页对象
     * @param xClass 转换的数据传输模型
     */
    protected <T, X extends EntityDataModel> ResultItems<X> getPageResult(Page<T> page, Class<X> xClass) {
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
    protected <T, X extends EntityDataModel> ResultItems<X> getListResult(List<T> list, Class<X> xClass) {
        ListConverter<T> lmc = new ListConverter<>(list);
        return this.getResult(lmc.toList(xClass));
    }

    /**
     * 树形结果
     * @param list 数据集合
     * @param xClass 转换的数据传输模型
     */
    protected <T, X extends TreeEntityDataModel> ResultItems<X> getTreeListResult(List<T> list, Class<X> xClass) {
        TreeConverter<T> lmc = new TreeConverter<>(list);
        return this.getResult(lmc.toTree(xClass));
    }
}
