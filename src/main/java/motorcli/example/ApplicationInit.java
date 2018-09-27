package motorcli.example;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

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
//        log.info("Application Init Start");
//
//        String username = "WuCai";
//        String password = "112233!!@@##";
//        boolean rememberClient = true;
//
//        String serverUrl = "http://172.25.1.10:5000/";
//
//        String tokenUrl = serverUrl + "api/TokenAuth/Authenticate";
//
//        Map<String, Object> params = new HashMap<>();
//        params.put("userNameOrEmailAddress", username);
//        params.put("password", password);
//        params.put("rememberClient", rememberClient);
//
//        String result = HttpUtils.postJson(tokenUrl, JsonUtils.toJson(this.objectMapper, params, false));
//
//        Map<String, Object> jsonMap = JsonUtils.jsonStrToMap(this.objectMapper, result);
//
//        Map<String, Object> resultJson = (Map<String, Object>) jsonMap.get("result");
//
//        String accessToken = (String) resultJson.get("accessToken");
//        Integer expireInSeconds = (Integer) resultJson.get("expireInSeconds");
//
//        log.info("accessToken is -> [" + accessToken + "]");
//
//        ConfigReader.getInstance().add("accessToken", accessToken);
//        ConfigReader.getInstance().add("expireInSeconds", expireInSeconds * 1000);
//        ConfigReader.getInstance().add("tokenTime", new Date().getTime());
//
//
//
//        log.info("Application Init End");
    }
}
