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
	public class TweetCommentService : ITweetCommentService
	{
		private readonly CurrentUserIdAccessor _userAccessor;
		private readonly IRawSqlService _rawSql;
		private readonly TweeterDbContext _dbContext;
		private readonly ICloudService _cloud;

		public TweetCommentService(
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

		public async Task<Response<TweetCommentDto>> CreateAsync(TweetCommentForCreation comment)
		{
			var result = new Response<TweetCommentDto>();

			var newComment = new TweetComment
			{
				CreatedAt = DateTime.UtcNow,
				CreatedById = _userAccessor.CurrentUserId,
				Text = comment.Text,
				TweetId = comment.TweetId
			};

			if (comment.Img != null)
			{
				var res = await _cloud.UploadAsync(comment.Img);
				newComment.ImgUrl = res.Url;
			}

			var tweet = await _dbContext.Tweet.FirstOrDefaultAsync(t => t.Id == comment.TweetId);
			tweet.CommentCount++;

			await _dbContext.TweetComment.AddAsync(newComment);
			await _dbContext.SaveChangesAsync();

			result.Item = await Get(newComment.Id);

			return result;
		}

		public async Task<Response<bool>> LikeAsync(int commentId)
		{
			var result = new Response<bool>();

			var comment = await _dbContext.TweetComment.FirstOrDefaultAsync(tc => tc.Id == commentId);
			comment.LikeCount++;

			var newLike = new TweetCommentLike
			{
				TweetCommentId = commentId,
				UserId = _userAccessor.CurrentUserId
			};
			
			await _dbContext.TweetCommentLike.AddAsync(newLike);
			await _dbContext.SaveChangesAsync();

			result.Item = true;

			return result;
		}

		public async Task<PageResponse<TweetCommentDto>> SearchAsync(TweetCommentSearchParam param)
		{
			var result = new PageResponse<TweetCommentDto>();

			Func<object[], TweetCommentDto> map = (objects) =>
			{
				TweetCommentDto comment = (TweetCommentDto)objects[0];
				comment.CreatedBy = (UserDto)objects[1];
				result.TotalCount = ((Total)objects[2]).TotalCount;

				return comment;
			};

			param.CurrentUserId = _userAccessor.CurrentUserId;
			param.SortProp = "tc." + param.SortProp;
			var types = new[] { typeof(TweetCommentDto), typeof(UserDto), typeof(Total) };
			result.Items = await _rawSql.Search<TweetCommentDto>(DataBase.SqlQueries.TweetComment.SearchComments, param, types, map, "_split_");

			return result;
		}

		public async Task<TweetCommentDto> Get(int id)
		{
			Func<object[], TweetCommentDto> map = (objects) =>
			{
				TweetCommentDto comment = (TweetCommentDto)objects[0];
				comment.CreatedBy = (UserDto)objects[1];
				return comment;
			};

			var types = new[] { typeof(TweetCommentDto), typeof(UserDto) };
			return (await _rawSql.Search<TweetCommentDto>(DataBase.SqlQueries.TweetComment.GetById, new { id }, types, map, "_split_"))
				.FirstOrDefault();
		}
	}
}
