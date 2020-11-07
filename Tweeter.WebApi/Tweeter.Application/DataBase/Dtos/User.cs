namespace Tweeter.Application.DataBase.Dtos
{
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
}
