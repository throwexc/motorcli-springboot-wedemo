package motorcli.example.common.interceptor;

import motorcli.example.common.annotation.NoCheckSession;
import motorcli.example.common.annotation.NoCheckSession;
import motorcli.example.common.annotation.NoCheckSession;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;

public class CheckSessionInterceptor implements HandlerInterceptor {
	
	/**
	 * 生成视图时执行，可以用来处理异常，并记录在日志中
	 */
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object arg2, Exception exception){
		
	}

	/** -
	 * 生成视图之前执行，可以修改ModelAndView
	 */
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object arg2, ModelAndView arg3) throws Exception{
		
	}

	/**
	 * 进入拦截器后首先进入的方法
	 * 返回false则不再继续执行
	 * 返回true则继续执行
	 */
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		String path = request.getContextPath();
		if(request.getRequestURI().equals(path) || request.getRequestURI().equals(path + "/")) {
			return true;
		}
		HandlerMethod handlerMethod = null;
		try {
			handlerMethod = (HandlerMethod)handler;
		} catch(ClassCastException ex) {
			return true;
		}
		RestController restController = handlerMethod.getBean().getClass().getAnnotation(RestController.class);
		if(restController != null) {
			return true;
		}

		NoCheckSession noCheckSession = handlerMethod.getMethodAnnotation(NoCheckSession.class);
		ResponseBody jsonMethod = handlerMethod.getMethodAnnotation(ResponseBody.class);
		
		if(noCheckSession == null) {
			if(request.getSession().getAttribute("session_user_info") == null) {
				boolean isAjax = this.isAjax(request);
				if(isAjax || jsonMethod != null) {
					response.reset();
					response.setContentType("application/json; charset=UTF-8");
					PrintWriter pw = response.getWriter();
					pw.write("{\"code\" : -1, \"info\":\"SESSION超时\"}");
					pw.flush();
					pw.close();
					return false;
				} else {
					response.sendRedirect(path + "/");
					return false;
				}
			}
		}
		return true;
	}

	/**
	 * 判断ajax请求
	 * @param request
	 * @return
	 */
	boolean isAjax(HttpServletRequest request){
		return  (request.getHeader("X-Requested-With") != null  && "XMLHttpRequest".equals( request.getHeader("X-Requested-With").toString())) ;
	}
}
