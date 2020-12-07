import { ApiPageRequest } from './Api';

export class User {
    public id: number;
    public followersCount: number;
    public followeesCount: number;
    public avatarUrl: string;
    public name: string;
    public about: string;
    public profileCoverUrl: string;
    public isFolloweeOfCurrentUser: boolean;
    public avatar: File;
    public cover: File;
}

export class UserSearchParam extends ApiPageRequest {
    public followersOfUserId: number;
    public followeesOfUserId: number;
    public appendToExistingStorePage: boolean;
    public idNotEqual: number;
    public nameContains: string;
    public notFolloweeOfUserId: number;
}
