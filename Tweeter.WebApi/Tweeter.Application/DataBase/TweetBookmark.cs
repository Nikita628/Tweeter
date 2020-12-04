using System;

namespace Tweeter.Application.DataBase
{
	public class TweetBookmark
	{
		public int TweetId { get; set; }
		public int UserId { get; set; }
		public DateTime CreatedAt { get; set; }

		public User User { get; set; }
		public Tweet Tweet { get; set; }
	}
}
