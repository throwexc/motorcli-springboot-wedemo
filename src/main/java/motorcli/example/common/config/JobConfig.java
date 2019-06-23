package motorcli.example.common.config;

import motorcli.example.job.TestJob;
import org.quartz.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JobConfig {

    @Bean
    public JobDetail testJob1() {
        return JobBuilder.newJob(TestJob.class).withIdentity("testJob1").storeDurably().build();
    }

    @Bean
    public Trigger testJob1Trigger() {
        SimpleScheduleBuilder simpleScheduleBuilder = SimpleScheduleBuilder.simpleSchedule()
                .withIntervalInSeconds(5)
                .repeatForever();
        return TriggerBuilder.newTrigger()
                .forJob(testJob1())
                .withSchedule(simpleScheduleBuilder)
                .withIdentity("testJob1")
                .build();
    }
}
