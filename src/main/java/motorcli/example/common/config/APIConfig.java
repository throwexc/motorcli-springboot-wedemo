package motorcli.example.common.config;

import com.motorcli.springboot.restful.utils.DocketInfo;
import com.motorcli.springboot.restful.utils.DocketUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spring.web.plugins.Docket;

import java.util.ArrayList;

@Configuration
public class APIConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api*//**");
    }

    @Bean
    public Docket sysApiDoc() {
        DocketInfo docketInfo = DocketInfo
                .builder()
                .groupName("系统管理接口")
                .basePackage("motorcli.example.controller.api.sys")
                .apiInfo(apiInfo())
                .build();
        return DocketUtils.JWTBuilder(docketInfo);
    }

    private ApiInfo apiInfo() {

        Contact contact = new Contact("Li", "https://github.com/throwexc", "306760249@qq.com");

        ApiInfo apiInfo = new ApiInfo("MotorCli Web 脚手架工程",//大标题
                "服务端接口",//小标题
                "版本0.1",//版本
                "",
                contact,//作者
                "",//链接显示文字
                "",//网站链接,
                new ArrayList()
        );
        return apiInfo;
    }
}
