package motorcli.example.common.config;

import motorcli.example.common.interceptor.CheckSessionInterceptor;
import motorcli.example.common.interceptor.CommonAttrInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.format.datetime.DateFormatter;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

//import com.motor.common.web.interceptor.WebDebugInterceptor;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * 注册静态资源路由
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
//        registry.addResourceHandler("/upload/**").addResourceLocations("/upload/").setCachePeriod(0);
        registry.addResourceHandler("/script/**").addResourceLocations("classpath:/static/script/").setCachePeriod(0);
        registry.addResourceHandler("/css/**").addResourceLocations("classpath:/static/css/").setCachePeriod(0);
        registry.addResourceHandler("/image/**").addResourceLocations("classpath:/static/image/").setCachePeriod(0);
        registry.addResourceHandler("/lib/**").addResourceLocations("classpath:/static/lib/").setCachePeriod(0);
    }

    /**
     * 注册拦截器
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new CommonAttrInterceptor());
        registry.addInterceptor(new CheckSessionInterceptor()).excludePathPatterns("/api**", "/wx/**", "/swagger**", "/v2/**", "/configuration/**", "/error**");
        //registry.addInterceptor(new WebDebugInterceptor());
    }

    /**
     * 注册格式化器
     */
    @Override
    public void addFormatters(final FormatterRegistry registry) {
        registry.addFormatter(dateFormatter());
    }

    /**
     * 日期格式化 Bean
     */
    @Bean
    public DateFormatter dateFormatter() {
        return new WebDateFormatter();
    }

    /**
     * 日期格式化实现
     */
    class WebDateFormatter extends DateFormatter{

        @Override
        public String print(Date date, Locale locale) {
            return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(date);
        }
    }
}
