using System;
using System.Collections.Generic;
using System.Text;

namespace Tweeter.Application.DataBase.Dtos
{
	public class TweetDto
	{
		public int Id { get; set; }
		public string ImgUrl { get; set; }
		public string Text { get; set; }
		public int? RetweetedFromId { get; set; }
		public int LikeCount { get; set; }
		public int RetweetCount { get; set; }
		public int BookmarkCount { get; set; }
		public bool OnlyFollowedCanReply { get; set; }
		public int CreatedById { get; set; }
		public bool IsLikedByCurrentUser { get; set; }
		public bool IsBookmarkedByCurrentUser { get; set; }
		public bool IsCommentedByCurrentUser { get; set; }
		public DateTime CreatedAt { get; set; }
		public UserDto CreatedBy { get; set; }
		public TweetDto OriginalTweet { get; set; }
	}
}
