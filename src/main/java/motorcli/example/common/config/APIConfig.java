package motorcli.example.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.async.DeferredResult;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

import java.util.ArrayList;

import static springfox.documentation.builders.PathSelectors.regex;

@Configuration
public class APIConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api*//**");
    }

    @Bean
    public Docket sysApiDoc() {
        return new Docket(DocumentationType.SWAGGER_2)
                .groupName("API 接口")
                .genericModelSubstitutes(DeferredResult.class)
                .useDefaultResponseMessages(false)
                .forCodeGeneration(true)
                .pathMapping("/")
                .select()
                .paths(regex("/api/sys/.*"))//过滤的接口
                .build()
                .apiInfo(apiInfo());
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
