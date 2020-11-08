namespace Tweeter.Application.Models
{
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
