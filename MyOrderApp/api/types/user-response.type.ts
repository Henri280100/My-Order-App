import { User } from "./user.types"

export interface UserReponse {
    status: string,
    data: {
        user: User
    }
}