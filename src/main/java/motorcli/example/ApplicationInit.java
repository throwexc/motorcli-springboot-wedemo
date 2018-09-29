package motorcli.example;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.motorcli.springboot.common.utils.HttpUtils;
import com.motorcli.springboot.common.utils.JsonUtils;
import lombok.extern.slf4j.Slf4j;
import motorcli.example.common.config.ConfigReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * 应用初始化
 */
@Component
@Slf4j
public class ApplicationInit implements ApplicationRunner {

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public void run(ApplicationArguments applicationArguments) throws Exception {
        log.info("Application Init Start");

        //LoginProcessingFilter
        //LoginAuthenticationProvider
        //TokenAuthenticationProcessingFilter

        String username = "admin";
        String password = "123";

        String serverUrl = "http://127.0.0.1:8088/";

        String tokenUrl = serverUrl + "api/auth/authenticate";

        Map<String, String> params = new HashMap<>();
        params.put("username", username);
        params.put("password", password);

        String result = HttpUtils.post(tokenUrl, params);

        Map<String, Object> jsonMap = JsonUtils.jsonStrToMap(this.objectMapper, result);

        Map<String, Object> claims = (Map<String, Object>) jsonMap.get("claims");

        String accessToken = (String) jsonMap.get("token");
        String refreshToken = (String) jsonMap.get("refreshToken");
        Integer expireTime = (Integer) claims.get("exp");

        log.info("accessToken is -> [" + accessToken + "]");

        ConfigReader.getInstance().add("accessToken", accessToken);
        ConfigReader.getInstance().add("refreshToken", refreshToken);
        ConfigReader.getInstance().add("expireInSeconds", new Date(expireTime));
        ConfigReader.getInstance().add("tokenTime", new Date().getTime());

        log.info("Application Init End");
    }
}
