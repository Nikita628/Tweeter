namespace Tweeter.Application.DataBase
{
	public class TweetCommentLike
	{
		public int TweetCommentId { get; set; }
		public int UserId { get; set; }

		public User User { get; set; }
		public TweetComment TweetComment { get; set; }
	}
}
