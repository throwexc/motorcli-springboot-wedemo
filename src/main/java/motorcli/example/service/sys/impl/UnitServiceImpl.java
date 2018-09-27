package motorcli.example.service.sys.impl;

import motorcli.example.dto.sys.UnitModel;
import motorcli.example.emnus.sys.UnitType;
import motorcli.example.entity.sys.Unit;
import motorcli.example.mapper.sys.UnitMapper;
import com.motorcli.springboot.common.utils.CollectionUtils;
import motorcli.example.dto.sys.UnitModel;
import motorcli.example.emnus.common.DataState;
import motorcli.example.emnus.sys.UnitType;
import motorcli.example.entity.sys.Unit;
import motorcli.example.exceptions.ExistChildCanNotDeleteException;
import motorcli.example.exceptions.NotAffectedDataException;
import motorcli.example.mapper.sys.UnitMapper;
import motorcli.example.service.sys.UnitService;
import motorcli.example.dto.sys.UnitModel;
import motorcli.example.emnus.sys.UnitType;
import motorcli.example.entity.sys.Unit;
import motorcli.example.mapper.sys.UnitMapper;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class UnitServiceImpl implements UnitService {

    @Autowired
    private UnitMapper unitDao;

    @Override
    public List<Unit> queryAll() {
        return this.unitDao.queryNotDelete();
    }

    @Override
    public Unit save(UnitModel model) {
        Unit unit;
        if(!StringUtils.isEmpty(model.getId())) {
            unit = this.unitDao.queryById(model.getId());
        } else {
            unit = new Unit();
            unit.setCreateTime(new Date());
        }

        if(!StringUtils.isEmpty(model.getParentId())) {
            unit.setParentId(model.getParentId());
        }

        unit.setName(model.getName());
        unit.setOrderNum(model.getOrderNum());
        unit.setUpdateTime(new Date());

        if(model.getUnitType() != null) {
            unit.setUnitType(UnitType.typeOf(model.getUnitType()).code());
        }

        if(!StringUtils.isEmpty(model.getRemark())) {
            unit.setRemark(model.getRemark());
        } else {
            unit.setRemark(null);
        }

        int unitFlag;

        if(!StringUtils.isEmpty(unit.getId())) {
            unitFlag = this.unitDao.updateByPrimaryKey(unit);
        } else {
            unit.setId(UUID.randomUUID().toString());
            unitFlag = this.unitDao.insert(unit);
        }

        if(unitFlag <= 0) {
            throw new NotAffectedDataException();
        }

        return unit;
    }

    @Override
    public void deleteById(String id) {
        List<Unit> children = this.unitDao.queryNotDeleteByParentId(id);
        if(!CollectionUtils.isEmpty(children)) {
            throw new ExistChildCanNotDeleteException();
        }
        // 逻辑删除
        Unit unit = this.unitDao.queryById(id);
        unit.setDataState(DataState.DELETE.code());
        this.unitDao.updateByPrimaryKey(unit);
    }
}
