package motorcli.example.controller.web;

import motorcli.example.common.base.BaseController;
import motorcli.example.common.config.ConfigReader;
import motorcli.example.dto.sys.ModuleModel;
import motorcli.example.dto.sys.UserModel;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;
import java.util.List;

/**
 * 功能主框架
 */
@Controller
@Scope("prototype")
@RequestMapping("/main")
public class MainController extends BaseController {

    //@Autowired
    //private MessageService messageService;

    /**
     * 主框架页面
     */
    @RequestMapping(value = "/index", method = RequestMethod.GET)
    public ModelAndView mainIndex() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("/main/main");
        return mv;
    }

    @RequestMapping(value = "/init/info", method = RequestMethod.GET)
    @ResponseBody
    public ModelMap getUserInfo(HttpSession session) {
        UserModel userInfo = (UserModel) session.getAttribute(SESSION_USER_INFO);
        List<ModuleModel> userModules = (List<ModuleModel>) session.getAttribute(USER_MODULES);

        ModelMap modelMap = new ModelMap();
        modelMap.put("code", 1);
        modelMap.put("msgCount", 0);
        modelMap.put("userInfo", userInfo);
        modelMap.put("userModules", userModules);
        modelMap.put("accessToken", ConfigReader.getInstance().get("accessToken"));

//        modelMap.put("msgCount", this.messageService.countNewMessageByUserId(userInfo.getId()));
        return modelMap;
    }
}
