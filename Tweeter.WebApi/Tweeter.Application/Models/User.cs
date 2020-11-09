namespace Tweeter.Application.Models
{
	public class UserForUpdate
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public string About { get; set; }
		public File Avatar { get; set; }
		public File ProfileCover { get; set; }
	}

	public class UserDto
	{
		public int Id { get; set; }
		public int FollowersCount { get; set; }
		public int FolloweesCount { get; set; }
		public string AvatarUrl { get; set; }
		public string Name { get; set; }
		public string About { get; set; }
		public string ProfileCoverUrl { get; set; }
	}

	public class UserSearchParam : PageRequest
	{
		public int? FollowersOfUserId { get; set; }
		public int? FolloweesOfUserId { get; set; }
	}
}
