import { GetUserService } from '../services/user.service.js';

export class GetUserController{

    getUserService = new GetUserService();
    
    getUser = async (req, res, next) => {
        try{
            const { userId } = req.user;

            const getUser = await this.getUserService.findUser(userId);

            return res.status(200).json({data: getUser});
        } catch(error){
            next(error);
        }
    }
};