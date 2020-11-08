using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
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
				CreatedById = _userAccessor.CurrentUserId,
				RetweetedFromId = originalTweet.Id,
				CreatedAt = DateTime.UtcNow
			};

			await _dbContext.Tweet.AddAsync(newTweet);
			await _dbContext.SaveChangesAsync();

			result.Item = true;

			return result;
		}

		public async Task<PageResponse<TweetDto>> SearchAsync(TweetSearchParam param)
		{
   //         param = new TweetSearchParam();
   //         param.PageSize = 80;
   //         param.PageNumber = 1;
   //         param.SortProp = "id";
   //         param.SortDirection = "asc";
			//param.CurrentUserId = 2;

            var result = new PageResponse<TweetDto>();

			var tweetsDict = new Dictionary<int, TweetDto>(param.PageSize);

			Func<object[], TweetDto> map = (objects) =>
			{
				TweetDto tweet = (TweetDto)objects[0];
				tweet.CreatedBy = (UserDto)objects[1];
				
				if (tweet.RetweetedFromId.HasValue)
				{
					tweet.OriginalTweet = (TweetDto)objects[2];
					tweet.OriginalTweet.CreatedBy = (UserDto)objects[3];
					tweetsDict.TryAdd(tweet.RetweetedFromId.Value, tweet.OriginalTweet);
				} 
				else
                {
					tweetsDict.Add(tweet.Id, tweet);
				}

				result.TotalCount = ((Total)objects[4]).TotalCount;

				return tweet;
			};

			param.SortProp = "t." + param.SortProp;
			var types = new[] { typeof(TweetDto), typeof(UserDto), typeof(TweetDto), typeof(UserDto), typeof(Total) };
			result.Items = await _rawSql.Search<TweetDto>(DataBase.SqlQueries.Tweet.SearchTweets, param, types, map, "_split_");

			PopulateTweetComments(result.Items, tweetsDict);

			return result;
		}

		private async void PopulateTweetComments(List<TweetDto> items, Dictionary<int, TweetDto> tweetsDict)
		{
			Func<object[], TweetCommentDto> commentMap = (objects) =>
			{
				TweetCommentDto comment = (TweetCommentDto)objects[0];
				comment.CreatedBy = (UserDto)objects[1];
				tweetsDict[comment.TweetId].TweetComments.Add(comment);

				return comment;
			};

			var commentDbParam = new
			{
				currentUserId = _userAccessor.CurrentUserId,
				tweetIds = items.Select(i => i.RetweetedFromId.HasValue ? i.RetweetedFromId.Value : i.Id).ToList()
			};

			var commentTypes = new[] { typeof(TweetCommentDto), typeof(UserDto) };

			await _rawSql.Search<TweetCommentDto>(
				DataBase.SqlQueries.TweetComment.SearchCommentsForTweets,
				commentDbParam,
				commentTypes,
				commentMap,
				"_split_"
			);
		}
	}
}
