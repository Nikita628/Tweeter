using System;

namespace Tweeter.Application.Models
{
	public class TweetCommentDto
	{
		public int Id { get; set; }
		public string Text { get; set; }
		public string ImgUrl { get; set; }
		public int TweetId { get; set; }
		public int LikeCount { get; set; }
		public bool IsLikedByCurrentUser { get; set; }
		public DateTime CreatedAt { get; set; }
		public UserDto CreatedBy { get; set; }
	}

	public class TweetCommentForCreation
	{
		public string Text { get; set; }
		public int TweetId { get; set; }
		public File Img { get; set; }
	}

	public class TweetCommentSearchParam : PageRequest
	{
		public int? CurrentUserId { get; set; }
		public int? TweetId { get; set; }
		public int? IdLessThan { get; set; }
	}
}
