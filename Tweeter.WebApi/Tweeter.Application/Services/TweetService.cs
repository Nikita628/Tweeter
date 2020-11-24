using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Tweeter.Application.Contracts;
using Tweeter.Application.DataBase;
using Tweeter.Application.Models;
using Tweeter.Application.Utils;

namespace Tweeter.Application.Services
{
	public class TweetService : ITweetService
	{
		private readonly CurrentUserIdAccessor _userAccessor;
		private readonly IRawSqlService _rawSql;
		private readonly TweeterDbContext _dbContext;
		private readonly ICloudService _cloud;

		public TweetService(
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

		public async Task<Response<bool>> BookmarkAsync(int tweetId)
		{
			var result = new Response<bool>();

			var newBookmark = new TweetBookmark
			{
				TweetId = tweetId,
				UserId = _userAccessor.CurrentUserId
			};

			var existingTweet = await _dbContext.Tweet.FirstOrDefaultAsync(t => t.Id == tweetId);
			existingTweet.BookmarkCount++;
			await _dbContext.TweetBookmark.AddAsync(newBookmark);
			await _dbContext.SaveChangesAsync();

			result.Item = true;

			return result;
		}

		public async Task<Response<TweetDto>> CreateAsync(TweetForCreation tweet)
		{
			var result = new Response<TweetDto>();

			if (string.IsNullOrWhiteSpace(tweet.Text))
			{
				result.Errors.Add("Tweet text is empty");
				return result;
			}

			var newTweet = new Tweet
			{
				Text = tweet.Text,
				OnlyFollowedCanReply = tweet.OnlyFollowedCanReply,
				CreatedAt = DateTime.UtcNow,
				CreatedById = _userAccessor.CurrentUserId
			};

			if (tweet.Img != null)
			{
				var res = await _cloud.UploadAsync(tweet.Img);
				newTweet.ImgUrl = res.Url;
			}

			//await ProcessHashTags(tweet.Text);
			await _dbContext.Tweet.AddAsync(newTweet);
			await _dbContext.SaveChangesAsync();
			result.Item = await Get(newTweet.Id);

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

			var existingTweet = await _dbContext.Tweet.FirstOrDefaultAsync(t => t.Id == tweetId);
			existingTweet.LikeCount++;
			await _dbContext.TweetLike.AddAsync(newLike);
			await _dbContext.SaveChangesAsync();

			result.Item = true;

			return result;
		}

		public async Task<Response<TweetDto>> RetweetAsync(int tweetId)
		{
			var result = new Response<TweetDto>();

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
				CreatedAt = DateTime.UtcNow,
				Text = string.Empty
			};

			originalTweet.RetweetCount++;
			await _dbContext.Tweet.AddAsync(newTweet);
			await _dbContext.SaveChangesAsync();

			result.Item = await Get(newTweet.Id);

			return result;
		}

		public async Task<PageResponse<TweetDto>> SearchAsync(TweetSearchParam param)
		{
			var result = new PageResponse<TweetDto>();

			Func<object[], TweetDto> map = (objects) =>
			{
				TweetDto tweet = (TweetDto)objects[0];
				tweet.CreatedBy = (UserDto)objects[1];

				if (tweet.RetweetedFromId.HasValue)
				{
					tweet.OriginalTweet = (TweetDto)objects[2];
					tweet.OriginalTweet.CreatedBy = (UserDto)objects[3];
				}

				result.TotalCount = ((Total)objects[4]).TotalCount;

				return tweet;
			};

			param.CurrentUserId = _userAccessor.CurrentUserId;
			param.SortProp = "t." + param.SortProp;
			var types = new[] { typeof(TweetDto), typeof(UserDto), typeof(TweetDto), typeof(UserDto), typeof(Total) };
			result.Items = await _rawSql.Search<TweetDto>(DataBase.SqlQueries.Tweet.SearchTweets, param, types, map, "_split_");

			await PopulateTweetComments(result.Items);

			return result;
		}

		public async Task<TweetDto> Get(int id)
		{
			Func<object[], TweetDto> map = (objects) =>
			{
				TweetDto tweet = (TweetDto)objects[0];
				tweet.CreatedBy = (UserDto)objects[1];

				if (tweet.RetweetedFromId.HasValue)
				{
					tweet.OriginalTweet = (TweetDto)objects[2];
					tweet.OriginalTweet.CreatedBy = (UserDto)objects[3];
				}

				return tweet;
			};

			var types = new[] { typeof(TweetDto), typeof(UserDto), typeof(TweetDto), typeof(UserDto) };
			return (await _rawSql.Search<TweetDto>(
					DataBase.SqlQueries.Tweet.GetById,
					new { id, currentUserId = _userAccessor.CurrentUserId },
					types,
					map,
					"_split_"
				))
				.FirstOrDefault();
		}

		private async Task PopulateTweetComments(List<TweetDto> items)
		{
			var commentsDict = new Dictionary<int, List<TweetCommentDto>>();

			Func<object[], TweetCommentDto> commentMap = (objects) =>
			{
				TweetCommentDto comment = (TweetCommentDto)objects[0];
				comment.CreatedBy = (UserDto)objects[1];

				if (commentsDict.ContainsKey(comment.TweetId))
					commentsDict[comment.TweetId].Add(comment);
				else
					commentsDict.Add(comment.TweetId, new List<TweetCommentDto>() { comment });

				return comment;
			};

			var commentDbParam = new
			{
				currentUserId = _userAccessor.CurrentUserId,
				tweetIds = items.Select(i => i.RetweetedFromId.HasValue ? i.RetweetedFromId.Value : i.Id).ToList(),
				pageSize = 10
			};

			var commentTypes = new[] { typeof(TweetCommentDto), typeof(UserDto) };

			var comments = await _rawSql.Search<TweetCommentDto>(
				DataBase.SqlQueries.TweetComment.SearchCommentsForTweets,
				commentDbParam,
				commentTypes,
				commentMap,
				"_split_"
			);

			foreach (var tweet in items)
			{
				if (tweet.RetweetedFromId.HasValue && commentsDict.ContainsKey(tweet.RetweetedFromId.Value))
					tweet.OriginalTweet.TweetComments = commentsDict[tweet.RetweetedFromId.Value];

				if (commentsDict.ContainsKey(tweet.Id))
					tweet.TweetComments = commentsDict[tweet.Id];
			}
		}

		private async Task ProcessHashTags(string text)
		{
			// select all hashtags from tweet text
			// select all existing hashtags from db
			// for all existing hashtags, increment tweet count
			// for new hashtags, add new hashtag to db

			var searchHashTags = new Regex(@"#[^ ]*");
			var hashTagsFromNewTweet = searchHashTags.Matches(text).Select(m => m.Value).ToList();

			var param = new SqlParameter("hashTags", hashTagsFromNewTweet);
			var hashTagsFromDb = await _dbContext.HashTag
				.FromSqlRaw("select * from dbo.HashTag where Text in @hashTags", param)
				.ToDictionaryAsync((h) => h.Text);

			var newHashTags = new List<HashTag>();

			foreach (var h in hashTagsFromNewTweet)
			{
				if (hashTagsFromDb.TryGetValue(h, out HashTag htFromDb))
					htFromDb.TweetCount++;
				else
					newHashTags.Add(new HashTag { Text = h });
			}

			await _dbContext.HashTag.AddRangeAsync(newHashTags);
		}
	}
}
