package motorcli.example.common.interceptor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

/**
 * WEB调试
 */
@Slf4j
public class WebDebugInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o) throws Exception {
        log.info("###########################################  HTTP REQUEST LOG  ############################################");
        log.info("请求 URL             : [" + httpServletRequest.getRequestURL() + "]      method : [" + httpServletRequest.getMethod() + "]");
        log.info("请求 address         : [" + httpServletRequest.getRemoteAddr() + "]      host : [" + httpServletRequest.getRemoteHost() + "]      port : [" + httpServletRequest.getRemotePort() + "]");
        log.info("请求 headers         : [" + this.getHeadersInfo(httpServletRequest) + "]");
        log.info("请求 query params    : [" + httpServletRequest.getQueryString() + "]");
        Map<String, Object> params = new HashMap<>();

        Enumeration<String> enumeration = httpServletRequest.getParameterNames();

        while (enumeration.hasMoreElements()) {
            String key = enumeration.nextElement();
            params.put(key, httpServletRequest.getParameter(key));
        }

        HandlerMethod handlerMethod = (HandlerMethod) o ;

        log.info("请求 parameters      : [" + params + "]");
        log.info("请求 Class Method    : [" + handlerMethod.getBean().getClass().getName() + "." + handlerMethod.getMethod().getName() + "]");
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {

    }

    private Map<String, String> getHeadersInfo(HttpServletRequest request) {
        Map<String, String> map = new HashMap<>();
        Enumeration headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String key = (String) headerNames.nextElement();
            String value = request.getHeader(key);
            if(key.equals("content-type") || key.equals("accept")) {
                map.put(key, value);
            }

        }
        return map;
    }
}
