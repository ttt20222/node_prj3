export class GetUserService{
    constructor(getUserRepository) {
        this.getUserRepository = getUserRepository;
    }

    findUser = async (userId) => {
        const getUser = await this.getUserRepository.findUser(userId);

        return {
            userId: getUser.userId,
            email: getUser.email,
            name: getUser.name,
            role: getUser.role,
            createdAt: getUser.createdAt,
            updatedAt: getUser.updatedAt,
        }
    }
}