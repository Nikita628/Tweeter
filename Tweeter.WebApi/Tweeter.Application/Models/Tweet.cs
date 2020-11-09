using System;
using System.Collections.Generic;

namespace Tweeter.Application.Models
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
		public int CommentCount { get; set; }
		public bool OnlyFollowedCanReply { get; set; }
		public int CreatedById { get; set; }
		public bool IsLikedByCurrentUser { get; set; }
		public bool IsBookmarkedByCurrentUser { get; set; }
		public bool IsCommentedByCurrentUser { get; set; }
		public DateTime CreatedAt { get; set; }
		public UserDto CreatedBy { get; set; }
		public TweetDto OriginalTweet { get; set; }
		public List<TweetCommentDto> TweetComments { get; set; } = new List<TweetCommentDto>();
	}

	public class TweetSearchParam : PageRequest
	{
		public string TextContains { get; set; }
		public int? CreatedById { get; set; }
		public bool? OnlyWithComments { get; set; }
		public bool? OnlyWithMedia { get; set; }
		public int? OnlyLikedByUserId { get; set; }
		public int? FollowerId { get; set; } // tweets of people whom this user follows
        public int? CurrentUserId { get; set; }
    }
}
