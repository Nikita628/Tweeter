using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Tweeter.Application.Contracts;
using Tweeter.Application.DataBase;
using Tweeter.Application.DataBase.Dtos;
using Tweeter.Application.Models;
using Tweeter.Application.Utils;

namespace Tweeter.Application.Services
{
	public class TweetService : ITweetService
	{
		private readonly CurrentUserIdAccessor _userAccessor;
		private readonly IRawSqlService _rawSql;
		private readonly TweeterDbContext _dbContext;

		public TweetService(
			CurrentUserIdAccessor cu,
			TweeterDbContext tw,
			IRawSqlService ra
			)
		{
			_userAccessor = cu;
			_rawSql = ra;
			_dbContext = tw;
		}

		public async Task<Response<bool>> BookmarkAsync(int tweetId)
		{
			var result = new Response<bool>();

			var newBookmark = new TweetBookmark
			{
				TweetId = tweetId,
				UserId = _userAccessor.CurrentUserId
			};

			await _dbContext.TweetBookmark.AddAsync(newBookmark);
			await _dbContext.SaveChangesAsync();

			result.Item = true;

			return result;
		}

		public async Task<Response<int>> CreateAsync(Tweet tweet)
		{
			var result = new Response<int>();

			if (string.IsNullOrWhiteSpace(tweet.Text))
			{
				result.Errors.Add("Tweet text is empty");
				return result;
			}

			await _dbContext.Tweet.AddAsync(tweet);
			await _dbContext.SaveChangesAsync();

			result.Item = tweet.Id;

			return result;
		}

		public async Task<Response<bool>> LikeAsync(int tweetId)
		{
			var result = new Response<bool>();

			var newLike = new TweetLike
			{
				TweetId = tweetId,
				UserId = _userAccessor.CurrentUserId
			};

			await _dbContext.TweetLike.AddAsync(newLike);
			await _dbContext.SaveChangesAsync();

			result.Item = true;

			return result;
		}

		public async Task<Response<bool>> RetweetAsync(int tweetId)
		{
			var result = new Response<bool>();

			var originalTweet = await _dbContext.Tweet
				.FirstOrDefaultAsync(t => t.Id == tweetId);

			if (originalTweet is null)
			{
				result.Errors.Add($"Tweet with id {tweetId} was not found");
				return result;
			}

			var newTweet = new Tweet
			{
				ImgUrl = originalTweet.ImgUrl,
				CreatedById = _userAccessor.CurrentUserId,
				RetweetedFromId = originalTweet.Id,
				CreatedAt = DateTime.UtcNow,
				Text = originalTweet.Text
			};

			await _dbContext.Tweet.AddAsync(newTweet);
			await _dbContext.SaveChangesAsync();

			result.Item = true;

			return result;
		}

		public async Task<PageResponse<TweetDto>> SearchAsync(TweetSearchParam param)
		{
			param = new TweetSearchParam();
			param.PageSize = 20;
			param.PageNumber = 1;
			param.SortProp = "id";
			param.SortDirection = "asc";

			var result = new PageResponse<TweetDto>();

			var dbParam = new
			{
				text_ = param.TextContains,
				createdBy_ = param.CreatedById,
				onlyWithComments_ = param.OnlyWithComments,
				onlyWithMedia_ = param.OnlyWithMedia,
				onlyLikedByUserId_ = param.OnlyLikedByUserId,
				followerId_ = param.FollowerId,
				currentUserId_ = _userAccessor.CurrentUserId,

				sortProp_ = param.SortProp,
				sortDirection_ = param.SortDirection,

				pageNumber_ = param.PageNumber,
				pageSize_ = param.PageSize
			};

			Func<TweetDto, object, object, TweetDto> map = (tweet, user, originalTweet) =>
			{
				var ot = originalTweet as IDictionary<string, object>;
				var u = user as IDictionary<string, object>;
				//var s = ob as IDictionary<string, object>;
				//var a = s["OriginalTweetId"];
				//tweet.CreatedBy = user;

				return tweet;
			};

			var tweets = await _rawSql.Search(DbModel.SqlQueries.Tweet.SearchTweets, dbParam, map, "u_Id, ot_Id");

			return result;
		}
	}
}
