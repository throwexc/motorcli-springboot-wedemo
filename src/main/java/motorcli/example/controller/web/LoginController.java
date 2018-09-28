package motorcli.example.controller.web;

import motorcli.example.common.annotation.NoCheckSession;
import motorcli.example.common.base.BaseController;
import motorcli.example.dto.sys.CheckUserInfo;
import motorcli.example.dto.sys.ModuleModel;
import motorcli.example.dto.sys.UserModel;
import motorcli.example.entity.sys.Module;
import motorcli.example.service.sys.LoginLogService;
import motorcli.example.service.sys.ModuleService;
import motorcli.example.service.sys.UserService;
import com.motorcli.springboot.restful.dto.converter.TreeConverter;
import motorcli.example.common.annotation.NoCheckSession;
import motorcli.example.common.base.BaseController;
import motorcli.example.dto.sys.CheckUserInfo;
import motorcli.example.dto.sys.ModuleModel;
import motorcli.example.dto.sys.UserModel;
import motorcli.example.entity.sys.Module;
import motorcli.example.service.sys.LoginLogService;
import motorcli.example.service.sys.ModuleService;
import motorcli.example.service.sys.UserService;
import motorcli.example.common.annotation.NoCheckSession;
import motorcli.example.common.base.BaseController;
import motorcli.example.dto.sys.CheckUserInfo;
import motorcli.example.dto.sys.ModuleModel;
import motorcli.example.dto.sys.UserModel;
import motorcli.example.entity.sys.Module;
import motorcli.example.service.sys.LoginLogService;
import motorcli.example.service.sys.ModuleService;
import motorcli.example.service.sys.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.List;

/**
 * 登录
 */
@Controller
@Scope("prototype")
@RequestMapping("/login")
public class LoginController extends BaseController {

    @Autowired
    private UserService userService;

    @Autowired
    private ModuleService moduleService;

    @Autowired
    private LoginLogService loginLogService;

    @RequestMapping()
    @NoCheckSession
    public ModelAndView index() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("/index/index");
        return mv;
    }

    @RequestMapping("/check")
    @NoCheckSession
    public ModelAndView checkUser(@RequestParam String username, @RequestParam String password, HttpSession session, HttpServletRequest request, HttpServletResponse response, RedirectAttributes attr) {
        String remember = request.getParameter("remember");
        ModelAndView mv = new ModelAndView();
        CheckUserInfo checkUserInfo = this.userService.loginCheck(username, password);
        if(checkUserInfo.isSuccess()) {
            List<Module> moduleList = this.moduleService.queryUserSysModule(checkUserInfo.getUser().getId());
            TreeConverter<Module> tmc = new TreeConverter<>(moduleList);
            List<ModuleModel> moduleModels = tmc.toTree(ModuleModel.class);
            this.setWebContext(session, moduleModels, checkUserInfo.getUser(), remember, request, response, username, password);
            mv.setViewName("redirect:/main/index");
            String ip = this.getIp(request);
            this.loginLogService.add(checkUserInfo.getUser().getId(), ip);
        } else {
            attr.addFlashAttribute(MSG, checkUserInfo.getMsg());
            mv.setViewName("redirect:/login");
        }
        return mv;
    }

    private void setWebContext(HttpSession session, List<ModuleModel> modules, UserModel userModel, String remember, HttpServletRequest request, HttpServletResponse response, String username, String password) {
        session.setAttribute(SESSION_USER_INFO, userModel);
        session.setAttribute(USER_MODULES, modules);
        if(remember != null && remember.equals("remember")) {
            this.saveCookie(request, response, username, password);
        } else {
            this.saveCookie(request, response, null, null);
        }
    }

    private void saveCookie(HttpServletRequest request, HttpServletResponse response, String username, String password) {
        int cookieMaxAge = 365 * 24 * 60;

        if(username != null && password != null) {
            Cookie checkCookie = new Cookie("motor_cookie","true");
            checkCookie.setMaxAge(cookieMaxAge);
            checkCookie.setValue("true");
            checkCookie.setPath("/"); // 设置cookie的路径，否则前台无法读取cookie
            response.addCookie(checkCookie);

            Cookie usernameCookie = new Cookie("motor_cookie_username","true");
            usernameCookie.setMaxAge(cookieMaxAge);
            usernameCookie.setValue(username);
            usernameCookie.setPath("/"); // 设置cookie的路径，否则前台无法读取cookie
            response.addCookie(usernameCookie);

            Cookie passwordCookie = new Cookie("motor_cookie_password","true");
            passwordCookie.setMaxAge(cookieMaxAge);
            passwordCookie.setValue(password);
            passwordCookie.setPath("/"); // 设置cookie的路径，否则前台无法读取cookie
            response.addCookie(passwordCookie);
        } else {
            Cookie[] cookies = request.getCookies();
            if(cookies != null) {
                for(Cookie cookie : cookies) {
                    String cookieName = cookie.getName().trim();
                    if("motor_cookie".equals(cookieName) || "motor_cookie_username".equals(cookieName) || "motor_cookie_password".equals(cookieName)) {
                        cookie.setMaxAge(0);
                        cookie.setPath("/");
                        response.addCookie(cookie);
                    }
                }
            }
        }
    }
}
