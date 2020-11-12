using AutoMapper;

namespace Tweeter.Application.MapperConfigs
{
	public class UserConfig : Profile
	{
		public UserConfig()
		{
			CreateMap<DataBase.User, Models.UserDto>();
		}
	}
}
