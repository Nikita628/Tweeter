using System;

namespace Tweeter.Application.DataBase.Dtos
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
}
