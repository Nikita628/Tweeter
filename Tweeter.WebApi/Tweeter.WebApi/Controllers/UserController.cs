using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Tweeter.Application.Contracts;
using Tweeter.Application.Models;

namespace Tweeter.WebApi.Controllers
{
	//[Authorize]
	[ApiController]
	[Route("api/[controller]")]
	public class UserController : ControllerBase
	{
		private readonly IUserService _user;

		public UserController(IUserService tw)
		{
			_user = tw;
		}

		[HttpGet("get/{userId}")]
		public async Task<IActionResult> Get([FromRoute]int userId)
		{
			var result = await _user.GetAsync(userId);

			return Ok(result);
		}

		[HttpPost("search")]
		public async Task<IActionResult> Search(UserSearchParam param)
		{
			var result = await _user.SearchAsync(param);

			return Ok(result);
		}

		[HttpPut("update")]
		public async Task<IActionResult> Update(UserForUpdate param)
		{
			var result = await _user.UpdateAsync(param);

			return Ok(result);
		}

		[HttpPut("follow/{followeeId}")]
		public async Task<IActionResult> Follow([FromRoute]int followeeId)
		{
			var result = await _user.FollowAsync(followeeId);

			return Ok(result);
		}

		[HttpPut("unfollow/{followeeId}")]
		public async Task<IActionResult> Unfollow([FromRoute] int followeeId)
		{
			var result = await _user.UnfollowAsync(followeeId);

			return Ok(result);
		}
	}
}
