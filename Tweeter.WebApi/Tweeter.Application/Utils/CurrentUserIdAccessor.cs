using Microsoft.AspNetCore.Http;
using System.Linq;
using System.Security.Claims;

namespace Tweeter.Application.Utils
{
	public class CurrentUserIdAccessor
	{
		public readonly int CurrentUserId;

		public CurrentUserIdAccessor(IHttpContextAccessor ca)
		{
			if (ca.HttpContext != null
				&& ca.HttpContext.User != null
				&& ca.HttpContext.User.Claims != null
				&& ca.HttpContext.User.Claims.Any())
			{
				var currentUserId = ca.HttpContext.User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value;
				CurrentUserId = int.Parse(currentUserId);
			}
		}
	}
}
