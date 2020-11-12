export class BaseResponse {
    public errors: string[] = [];
}

export class ApiResponse<T> extends BaseResponse {
    public item: T;
}

export class ApiPageResponse<T> extends BaseResponse {
    public items: T[] = [];
    public totalCount = 0;
}

export class ApiPageRequest {
    public pageNumber = 1;
    public pageSize = 20;
    public sortProp = "id";
    public sortDirection = "asc";
}
