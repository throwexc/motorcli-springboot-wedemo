package motorcli.example.service.sys.impl;

import motorcli.example.dto.sys.AreaModel;
import motorcli.example.entity.sys.Area;
import motorcli.example.mapper.sys.AreaMapper;
import motorcli.example.service.sys.AreaService;
import com.motorcli.springboot.common.utils.CollectionUtils;
import motorcli.example.dto.sys.AreaModel;
import motorcli.example.entity.sys.Area;
import motorcli.example.exceptions.ExistChildCanNotDeleteException;
import motorcli.example.exceptions.NotAffectedDataException;
import motorcli.example.mapper.sys.AreaMapper;
import motorcli.example.service.sys.AreaService;
import motorcli.example.dto.sys.AreaModel;
import motorcli.example.entity.sys.Area;
import motorcli.example.mapper.sys.AreaMapper;
import motorcli.example.service.sys.AreaService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class AreaServiceImpl implements AreaService {

    @Autowired
    private AreaMapper areaMapper;

    @Override
    public List<AreaModel> queryByParentId(String parentId) {
        List<Area> list;
        if(!StringUtils.isEmpty(parentId)) {
            list = this.areaMapper.queryByParentId(parentId);
        } else {
            list = this.areaMapper.queryHasNotParent();
        }

        List<AreaModel> resultList = new ArrayList<>();

        for(Area area : list) {
            long count = this.areaMapper.countByParentId(area.getId());
            if(count <= 0) {
                resultList.add(new AreaModel(area, true));
            } else {
                resultList.add(new AreaModel(area, false));
            }
        }

        return resultList;
    }

    @Override
    public Area save(AreaModel model) {
        Area area;
        if(!StringUtils.isEmpty(model.getId())){
            area = this.areaMapper.queryById(model.getId());
        } else {
            area = new Area();
        }

        if(!StringUtils.isEmpty(model.getParentId())){
           area.setParentId(model.getParentId());
        }

        area.setLevel(model.getLevel());
        area.setName(model.getName());
        area.setShortName(model.getName());
        area.setAdCode(model.getAdCode());
        area.setOrderNum(model.getOrderNum());

        int saveFlag;

        if(!StringUtils.isEmpty(area.getId())) {
            saveFlag = this.areaMapper.updateByPrimaryKey(area);
        } else {
            area.setId(UUID.randomUUID().toString());
            saveFlag = this.areaMapper.insert(area);
        }

        if(saveFlag <= 0) {
            throw new NotAffectedDataException();
        }

        return area;
    }

    @Override
    public void deleteById(String id) {
        List<Area> list = this.areaMapper.queryByParentId(id);
        if(!CollectionUtils.isEmpty(list)) {
            throw new ExistChildCanNotDeleteException();
        }
        this.areaMapper.deleteById(id);
    }

    @Override
    public List<Area> queryAllByTopId(String topId) {
        List<Area> list = new ArrayList<>();
        Area area = this.areaMapper.queryById(topId);
        if(area != null) {
            this.findAllChildren(area, list);
        }
        return list;
    }

    /**
     * 递归查询所有子节点
     * @param area 父节点对象
     * @param childrenList 所有子节点集合
     */
    private void findAllChildren(Area area, List<Area> childrenList) {
        childrenList.add(area);
        List<Area> children = this.areaMapper.queryByParentId(area.getId());
        if(!CollectionUtils.isEmpty(children)) {
            for(Area child : children) {
                this.findAllChildren(child, childrenList);
            }
        }
    }
}
