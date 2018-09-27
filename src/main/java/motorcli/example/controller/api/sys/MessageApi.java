package motorcli.example.controller.api.sys;

import motorcli.example.common.base.BaseApi;
import com.motorcli.springboot.restfull.result.ResultItems;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import motorcli.example.common.base.BaseApi;
import motorcli.example.dto.sys.MessageModel;
import motorcli.example.common.base.BaseApi;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/sys/message")
@Api(value = "系统消息")
public class MessageApi extends BaseApi {

    @RequestMapping(value = "/user/new", method = RequestMethod.GET)
    @ApiOperation("用户未读消息")
    public ResultItems<MessageModel> notReadList(@RequestParam @ApiParam("用户ID") String userId) {
        List<MessageModel> list = new ArrayList<>();
        return this.getResult(list);
    }


//    @RequestMapping(value = "/noread", method = RequestMethod.GET)
//    @ApiOperation("用户未读消息")
//    public ResultItems<MessageModel> notReadList(@RequestParam @ApiParam("用户ID") String userId) {
//        List<Message> list = this.messageService.notReadList(userId);
//        return this.getListResult(list, MessageModel.class);
//    }
//
//    @RequestMapping(value = "/read/{id}", method = RequestMethod.POST)
//    @ApiOperation(value="标记消息已读")
//    public ResultRecord<MessageModel> readMsg(@PathVariable String id, HttpSession session) {
//        Message message = this.messageService.read(id);
//        return this.getResult(new MessageModel(message));
//    }
//
//    @RequestMapping(value = "/push", method = RequestMethod.POST)
//    @ApiOperation("添加并发送信息")
//    public ResultRecord<MessageModel> addAndPushMessage(@RequestParam @ApiParam("消息创建用户") String userId, @RequestParam @ApiParam("接收用户ID") String sendUserId, @RequestParam @ApiParam("消息内容")  String content) {
//        Message message = this.messageService.pushMessage(userId, sendUserId, content);
//        return this.getResult(new MessageModel(message));
//    }
}
