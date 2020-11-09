using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Tweeter.Application.Contracts;
using Tweeter.Application.Models;

namespace Tweeter.WebApi.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class AuthController : ControllerBase
	{
		private readonly IAuthService _authService;

		public AuthController(IAuthService aus)
		{
			_authService = aus;
		}

		[HttpPost("signIn")]
		public async Task<IActionResult> SignIn(SignInData param)
		{
			var result = await _authService.SignInAsync(param.Login, param.Password);

			return Ok(result);
		}

		[HttpPost("signUp")]
		public async Task<IActionResult> SignUp(SignUpData signUpData)
		{
			var res = await _authService.SignUpAsync(signUpData);

			return Ok(res);
		}
	}
}
