using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Threading.Tasks;
using Tweeter.Application.Contracts;
using Tweeter.Application.DataBase;
using Tweeter.Application.Models;
using Tweeter.WebApi.Extensions;

namespace Tweeter.WebApi.Controllers
{
	[Authorize]
	[ApiController]
	[Route("api/[controller]")]
	public class TweetCommentController : ControllerBase
	{
		private readonly ITweetCommentService _comment;

		public TweetCommentController(ITweetCommentService tw)
		{
			_comment = tw;
		}

		[HttpPost("search")]
		public async Task<IActionResult> Search(TweetCommentSearchParam param)
		{
			var result = await _comment.SearchAsync(param);

			return Ok(result);
		}

		[HttpPost("create")]
		public async Task<IActionResult> Create([FromForm]IFormFile img, [FromForm]string commentJson)
		{
			var comment = JsonConvert.DeserializeObject<TweetCommentForCreation>(commentJson);

			if (img != null)
			{
				comment.Img = new Application.Models.File
				{
					FileName = img.FileName,
					Bytes = await img.ToByteArrayAsync()
				};
			}

			var result = await _comment.CreateAsync(comment);

			return Ok(result);
		}

		[HttpPost("like/{commentId}")]
		public async Task<IActionResult> Like([FromRoute]int commentId)
		{
			var result = await _comment.LikeAsync(commentId);

			return Ok(result);
		}
	}
}
