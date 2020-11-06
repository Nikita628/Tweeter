using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace Tweeter.Application.DbModel
{
	public class User : IdentityUser<int>
	{
		public int FollowersCount { get; set; }
		public int FolloweesCount { get; set; }
		public string AvatarUrl { get; set; }
		public string Name { get; set; }
		public string About { get; set; }
		public string ProfileCoverUrl { get; set; }

		public ICollection<Follow> Followers { get; set; }
		public ICollection<Follow> Followees { get; set; }
		public ICollection<TweetBookmark> TweetBookmarks { get; set; }
		public ICollection<TweetLike> TweetLikes { get; set; }
		public ICollection<TweetComment> TweetComments { get; set; }
		public ICollection<TweetCommentLike> TweetCommentLikes { get; set; }
	}
}
