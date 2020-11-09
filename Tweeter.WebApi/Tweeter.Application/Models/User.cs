namespace Tweeter.Application.Models
{
	public class User
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public string About { get; set; }
		public File Avatar { get; set; }
		public File ProfileCover { get; set; }
	}

	public class UserSearchParam : PageRequest
	{
		public int? FollowersOfUserId { get; set; }
		public int? FolloweesOfUserId { get; set; }
	}
}
