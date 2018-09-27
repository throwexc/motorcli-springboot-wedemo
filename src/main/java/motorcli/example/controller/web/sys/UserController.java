package motorcli.example.controller.web.sys;

import motorcli.example.common.base.BaseController;
import motorcli.example.dto.sys.UserModel;
import motorcli.example.entity.sys.User;
import motorcli.example.service.sys.UserService;
import motorcli.example.common.base.BaseController;
import motorcli.example.dto.sys.UserModel;
import motorcli.example.entity.sys.User;
import motorcli.example.service.sys.UserService;
import motorcli.example.common.base.BaseController;
import motorcli.example.dto.sys.UserModel;
import motorcli.example.entity.sys.User;
import motorcli.example.service.sys.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@Scope("prototype")
@RequestMapping("/sys/user")
public class UserController extends BaseController {

    @Autowired
    private UserService userService;


    @RequestMapping(value = "/edit/info", method = RequestMethod.POST)
    @ResponseBody
    public ModelMap editUser(@RequestBody UserModel saveModel) {
        User user = this.userService.updateUserBaseInfo(saveModel);
        return this.createRecordResult(new UserModel(user));
    }
}
