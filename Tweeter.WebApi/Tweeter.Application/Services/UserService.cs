using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using Tweeter.Application.Contracts;
using Tweeter.Application.DataBase;
using Tweeter.Application.Models;
using Tweeter.Application.Utils;

namespace Tweeter.Application.Services
{
	public class UserService : IUserService
	{
		private readonly CurrentUserIdAccessor _userAccessor;
		private readonly IRawSqlService _rawSql;
		private readonly TweeterDbContext _dbContext;
		private readonly ICloudService _cloud;

		public UserService(
			CurrentUserIdAccessor cu,
			TweeterDbContext tw,
			IRawSqlService ra,
			ICloudService cl
			)
		{
			_userAccessor = cu;
			_rawSql = ra;
			_dbContext = tw;
			_cloud = cl;
		}
		public async Task<Response<bool>> FollowAsync(int followeeId)
		{
			var result = new Response<bool>();

			var newFollow = new Follow
			{
				FolloweeId = followeeId,
				FollowerId = _userAccessor.CurrentUserId
			};

			var follower = await _dbContext.User.FirstOrDefaultAsync(u => u.Id == _userAccessor.CurrentUserId);
			var followee = await _dbContext.User.FirstOrDefaultAsync(u => u.Id == followeeId);
			follower.FolloweesCount++;
			followee.FollowersCount++;

			await _dbContext.Follow.AddAsync(newFollow);
			await _dbContext.SaveChangesAsync();

			return result;
		}

		public async Task<Response<UserDto>> GetAsync(int userId)
		{
			var result = new Response<UserDto>();

			Func<object[], UserDto> map = (objects) =>
			{
				UserDto user = (UserDto)objects[0];
				return user;
			};

			var types = new[] { typeof(UserDto) };
			var param = new { userId, currentUserId = _userAccessor.CurrentUserId };
			result.Item = (await _rawSql.Search<UserDto>(DataBase.SqlQueries.User.GetUser, param, types, map, "_split_")).FirstOrDefault();

			return result;
		}

		public async Task<PageResponse<UserDto>> SearchAsync(UserSearchParam param)
		{
			var result = new PageResponse<UserDto>();

			Func<object[], UserDto> map = (objects) =>
			{
				UserDto user = (UserDto)objects[0];
				result.TotalCount = ((Total)objects[1]).TotalCount;

				return user;
			};

			param.CurrentUserId = _userAccessor.CurrentUserId;
			var types = new[] { typeof(UserDto), typeof(Total) };
			result.Items = await _rawSql.Search<UserDto>(DataBase.SqlQueries.User.SearchUsers, param, types, map, "_split_");

			return result;
		}

		public async Task<Response<bool>> UnfollowAsync(int followeeId)
		{
			var result = new Response<bool>();

			var existingFollow = await _dbContext.Follow
				.FirstOrDefaultAsync(f => f.FolloweeId == followeeId && f.FollowerId == _userAccessor.CurrentUserId);

			var follower = await _dbContext.User.FirstOrDefaultAsync(u => u.Id == _userAccessor.CurrentUserId);
			var followee = await _dbContext.User.FirstOrDefaultAsync(u => u.Id == followeeId);
			follower.FolloweesCount--;
			followee.FollowersCount--;

			_dbContext.Remove(existingFollow);

			await _dbContext.SaveChangesAsync();

			result.Item = true;

			return result;
		}

		public async Task<Response<bool>> UpdateAsync(Models.UserForUpdate user)
		{
			var result = new Response<bool>();

			var existingUser = await _dbContext.User.FirstOrDefaultAsync(u => u.Id == user.Id);

			existingUser.Name = user.Name;
			existingUser.About = user.About;
			
			if (user.Avatar != null)
			{
				var avUplResult = await _cloud.UploadAsync(user.Avatar);
				existingUser.AvatarUrl = avUplResult.Url;
			}

			if (user.ProfileCover != null)
			{
				var covUplResult = await _cloud.UploadAsync(user.ProfileCover);
				existingUser.ProfileCoverUrl = covUplResult.Url;
			}

			await _dbContext.SaveChangesAsync();

			result.Item = true;

			return result;
		}
	}
}
