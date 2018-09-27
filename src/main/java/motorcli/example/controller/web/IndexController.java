package motorcli.example.controller.web;

import motorcli.example.common.annotation.NoCheckSession;
import motorcli.example.common.base.BaseController;
import motorcli.example.common.annotation.NoCheckSession;
import motorcli.example.common.base.BaseController;
import motorcli.example.common.annotation.NoCheckSession;
import motorcli.example.common.base.BaseController;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;

/**
 * WEB应用跟路径配置
 */
@Controller
@Scope("prototype")
@RequestMapping("/")
public class IndexController extends BaseController {

    /**
     * 系统首界面
     */
    @RequestMapping(method = RequestMethod.GET)
    @NoCheckSession
    public ModelAndView index() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("redirect:/login");
        return mv;
    }

    /**
     * 登录界面
     */
    @RequestMapping(value = "/login", method = RequestMethod.GET)
    @NoCheckSession
    public ModelAndView login() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("/login/login");
        return mv;
    }

    /**
     * 登录出
     */
    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    @NoCheckSession
    public ModelAndView logout(HttpSession httpSession) {
        this.clearSession(httpSession);
        ModelAndView mv = new ModelAndView();
        mv.setViewName("/login/login");
        return mv;
    }

    /**
     * 外部模块引用界面
     */
//    @RequestMapping(value = "/link", method = RequestMethod.GET)
//    public ModelAndView link() {
//        ModelAndView mv = new ModelAndView();
//        mv.setViewName("/common/link");
//        return mv;
//    }
}
