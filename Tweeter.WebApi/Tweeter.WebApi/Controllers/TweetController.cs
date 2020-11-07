using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tweeter.Application.Contracts;

namespace Tweeter.WebApi.Controllers
{
	[AllowAnonymous]
	[ApiController]
	[Route("api/[controller]")]
	public class TweetController : ControllerBase
	{
		private readonly ITweetService _tweet;

		public TweetController(ITweetService tw)
		{
			_tweet = tw;
		}

		[HttpGet("search")]
		public async Task<IActionResult> Search()
		{
			var result = await _tweet.SearchAsync(new Application.Models.TweetSearchParam());

			return Ok(result);
		}
	}
}
