using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace Tweeter.Application.DbModel
{
	public class User : IdentityUser<int>
	{
		public int FollowingCount { get; set; }
		public int FollowersCount { get; set; }
		public string AvatarUrl { get; set; }
		public string Name { get; set; }
		public string About { get; set; }
		public string ProfileCoverUrl { get; set; }

		public ICollection<Follow> Followers { get; set; }
		public ICollection<Follow> Following { get; set; }
	}
}
