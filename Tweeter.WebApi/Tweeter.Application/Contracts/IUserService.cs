using System.Threading.Tasks;
using Tweeter.Application.Models;

namespace Tweeter.Application.Contracts
{
	public interface IUserService
	{
		Task<Response<DataBase.User>> GetAsync(int userId);
		Task<PageResponse<UserDto>> SearchAsync(UserSearchParam param);
		Task<Response<bool>> FollowAsync(int followeeId);
		Task<Response<bool>> UnfollowAsync(int followeeId);
		Task<Response<bool>> UpdateAsync(Models.UserForUpdate user);
	}
}
