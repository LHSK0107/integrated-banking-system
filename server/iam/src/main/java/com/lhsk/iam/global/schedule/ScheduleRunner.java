package com.lhsk.iam.global.schedule;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ScheduleRunner {

	// testing...
	@Bean
    public ApplicationRunner executeTaskOnStartup(Scheduler scheduler) {
        return args -> {
            scheduler.insertMenuClick();
        };
    }
}
