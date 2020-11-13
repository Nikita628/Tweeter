using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Tweeter.Application.Contracts;

namespace Tweeter.WebApi.Controllers
{
	[Authorize]
	[ApiController]
	[Route("api/[controller]")]
	public class HashTagController : ControllerBase
	{
		private readonly IHashTagService _hashTag;

		public HashTagController(IHashTagService tw)
		{
			_hashTag = tw;
		}

		[HttpPost("search")]
		public async Task<IActionResult> Search()
		{
			var result = await _hashTag.SearchAsync(null);

			return Ok(result);
		}
	}
}
