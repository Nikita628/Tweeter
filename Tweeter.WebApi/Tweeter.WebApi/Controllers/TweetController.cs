using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Tweeter.Application.Contracts;
using Tweeter.Application.Models;

namespace Tweeter.WebApi.Controllers
{
	[Authorize]
	[ApiController]
	[Route("api/[controller]")]
	public class TweetController : ControllerBase
	{
		private readonly ITweetService _tweet;

		public TweetController(ITweetService tw)
		{
			_tweet = tw;
		}

		[HttpPost("search")]
		public async Task<IActionResult> Search(TweetSearchParam param)
		{
			var result = await _tweet.SearchAsync(param);

			return Ok(result);
		}

		[HttpPost("create")]
		public async Task<IActionResult> Create(Application.DataBase.Tweet param)
		{
			var result = await _tweet.CreateAsync(param);

			return Ok(result);
		}

		[HttpPut("retweet/{tweetId}")]
		public async Task<IActionResult> Retweet([FromRoute]int tweetId)
		{
			var result = await _tweet.RetweetAsync(tweetId);

			return Ok(result);
		}

		[HttpPut("like/{tweetId}")]
		public async Task<IActionResult> Like([FromRoute]int tweetId)
		{
			var result = await _tweet.LikeAsync(tweetId);

			return Ok(result);
		}

		[HttpPut("bookmark/{tweetId}")]
		public async Task<IActionResult> Bookmark([FromRoute]int tweetId)
		{
			var result = await _tweet.BookmarkAsync(tweetId);

			return Ok(result);
		}
	}
}
