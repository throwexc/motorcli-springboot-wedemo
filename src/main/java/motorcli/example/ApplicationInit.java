package motorcli.example;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.motorcli.springboot.common.utils.HttpUtils;
import com.motorcli.springboot.common.utils.JsonUtils;
import lombok.extern.slf4j.Slf4j;
import motorcli.example.common.config.ConfigReader;
import motorcli.example.job.TestJob2;
import org.quartz.*;
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

    @Autowired
    private Scheduler scheduler;

    @Override
    public void run(ApplicationArguments applicationArguments) throws Exception {
        log.info("Application Init Start");

        String username = "admin";
        String password = "admin";

        String serverUrl = "http://127.0.0.1:8088/";

        String tokenUrl = serverUrl + "authentication/token";

        Map<String, String> params = new HashMap<>();
        params.put("username", username);
        params.put("password", password);

        String result = HttpUtils.postJson(tokenUrl, JsonUtils.toJson(this.objectMapper, params, false));

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

        //this.createJobs();
    }

    private void createJobs() {

        log.info("Create Job Test 2 Begin");

        JobDetail jobDetail = JobBuilder.newJob(TestJob2.class).withIdentity("testJob2").storeDurably().build();

        SimpleScheduleBuilder simpleScheduleBuilder = SimpleScheduleBuilder.simpleSchedule()
                .withIntervalInSeconds(5)
                .repeatForever();

        Trigger trigger =  TriggerBuilder.newTrigger().forJob(jobDetail)
                .withIdentity("testJob2")
                .withSchedule(simpleScheduleBuilder)
                .build();

        try {
            this.scheduler.scheduleJob(jobDetail, trigger);
        } catch (SchedulerException e) {
            e.printStackTrace();
        }


        log.info("Create Job Test 2 End");
    }
}
