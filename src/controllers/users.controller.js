import { GetUserService } from '../services/user.service.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';

//내정보 조회
export class GetUserController{

    getUserService = new GetUserService();
    
    getUser = async (req, res, next) => {
        try{
            const { userId } = req.user;

            const getUser = await this.getUserService.findUser(userId);

            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                message: '내정보 조회에 성공했습니다.',
                data: getUser});
        } catch(error){
            next(error);
        }
    }
};