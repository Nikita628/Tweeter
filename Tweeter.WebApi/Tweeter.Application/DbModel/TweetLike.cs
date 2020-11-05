namespace Tweeter.Application.DbModel
{
	public class TweetLike
	{
		public int TweetId { get; set; }
		public int UserId { get; set; }

		public Tweet Tweet { get; set; }
		public User User { get; set; }
	}
}
