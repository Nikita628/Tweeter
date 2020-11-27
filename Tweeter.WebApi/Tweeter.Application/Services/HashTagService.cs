using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Tweeter.Application.Contracts;
using Tweeter.Application.DataBase;
using Tweeter.Application.Models;
using Tweeter.Application.Utils;

namespace Tweeter.Application.Services
{
	public class HashTagService : IHashTagService
	{
		private readonly CurrentUserIdAccessor _userAccessor;
		private readonly IRawSqlService _rawSql;
		private readonly TweeterDbContext _dbContext;

		public HashTagService(
			CurrentUserIdAccessor cu,
			TweeterDbContext tw,
			IRawSqlService ra
			)
		{
			_userAccessor = cu;
			_rawSql = ra;
			_dbContext = tw;
		}
		public async Task<PageResponse<HashTag>> SearchAsync(HashTagSearchParam param)
		{
			var result = new PageResponse<HashTag>();

			var query = _dbContext.HashTag
				.AsNoTracking()
				.OrderByDescending(h => h.TweetCount)
				.Skip(0)
				.Take(10);

			result.Items = await query.ToListAsync();
			result.TotalCount = await _dbContext.HashTag.CountAsync();

			return result;
		}
	}
}
