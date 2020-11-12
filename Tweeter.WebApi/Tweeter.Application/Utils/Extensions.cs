using AutoMapper;

namespace Tweeter.Application.Utils
{
	public static class Extensions
	{
		public static T To<T>(this object obj, IMapper map) 
		{
			return map.Map<T>(obj);
		}
	}
}
