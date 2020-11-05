using System.Collections.Generic;

namespace Tweeter.Application.DbModel
{
	public class Tweet : AuditedEntity
	{
		public int Id { get; set; }
		public string ImgUrl { get; set; }
		public string Text { get; set; }
		public int? RetweetedFromId { get; set; }
		public int LikeCount { get; set; }
		public int RetweetCount { get; set; }
		public int BookmarkCount { get; set; }
		public bool OnlyFollowedCanReply { get; set; }

		public Tweet RetweetedFrom { get; set; }
		public User CreatedBy { get; set; }
		public ICollection<Tweet> Retweets { get; set; }
	}
}
