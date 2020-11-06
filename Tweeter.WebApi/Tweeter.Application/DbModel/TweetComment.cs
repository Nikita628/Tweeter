namespace Tweeter.Application.DbModel
{
	public class TweetComment : AuditedEntity
	{
		public int Id { get; set; }
		public string Text { get; set; }
		public string ImgUrl { get; set; }
		public int TweetId { get; set; }
		public int LikeCount { get; set; }

		public Tweet Tweet { get; set; }
	}
}
