package net.goldnut.motor.acvivity.test;

import motorcli.example.Application;
import motorcli.example.dto.sys.UserModel;
import motorcli.example.entity.sys.User;
import motorcli.example.mapper.sys.UserMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = {Application.class})
public class ClassTest {

    @Autowired
    private UserMapper userMapper;

    @Test
    public void test1() {
        User user = this.userMapper.queryByUsername("admin");

        UserModel dto = new UserModel(user);

        System.out.println(dto);
    }
}
