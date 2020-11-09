namespace Tweeter.Application.Models
{
	public class TweetCommentSearchParam : PageRequest
	{
		public int? CurrentUserId { get; set; }
		public int? TweetId { get; set; }
	}
}
