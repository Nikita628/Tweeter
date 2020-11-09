using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Tweeter.Application.Common;
using Tweeter.Application.Contracts;
using Tweeter.Application.DataBase;
using Tweeter.Application.Models;

namespace Tweeter.Application.Services
{
	public class AuthService : IAuthService
	{
		private readonly AppSettings _appSetting;
		private readonly UserManager<DataBase.User> _userManager;
		private readonly SignInManager<DataBase.User> _signInManager;
		private readonly TweeterDbContext _db;

		public AuthService(
			IOptions<AppSettings> aps,
			UserManager<DataBase.User> um,
			SignInManager<DataBase.User> sm,
			TweeterDbContext db
		)
		{
			_appSetting = aps.Value;
			_userManager = um;
			_signInManager = sm;
			_db = db;
		}

		public async Task<Response<Models.SignInResult>> SignInAsync(string login, string password)
		{
			var result = new Response<Models.SignInResult>();

			if (string.IsNullOrWhiteSpace(login))
			{
				result.Errors.Add("Login is empty");
				return result;
			}

			if (string.IsNullOrWhiteSpace(password))
			{
				result.Errors.Add("Password is empty");
				return result;
			}

			var user = await _userManager.FindByNameAsync(login);

			if (user is null)
			{
				result.Errors.Add("Incorrect login and/or password");
				return result;
			}

			var res = await _signInManager.CheckPasswordSignInAsync(user, password, false);

			if (res.Succeeded)
			{
				var signInResult = new Models.SignInResult
				{
					User = await _db.Users.FirstAsync(u => u.Id == user.Id),
					Token = GenerateJwtToken(user)
				};

				result.Item = signInResult;
			}
			else
			{
				result.Errors.Add("Incorrect login and/or password");
			}

			return result;
		}

		public async Task<Response<bool>> SignUpAsync(SignUpData signUpData)
		{
			var result = new Response<bool>();

			if (string.IsNullOrWhiteSpace(signUpData.Email)) result.Errors.Add("Email is empty");
			if (string.IsNullOrWhiteSpace(signUpData.Name)) result.Errors.Add("Name is empty");
			if (string.IsNullOrWhiteSpace(signUpData.Password)) result.Errors.Add("Password is empty");
			if (result.Errors.Any()) return result;

			var existingUser = await _userManager.FindByNameAsync(signUpData.Email);

			if (existingUser != null)
			{
				result.Errors.Add($"User {signUpData.Email} already exists");
				return result;
			}

			var user = new DataBase.User
			{
				Name = signUpData.Name,
				UserName = signUpData.Email,
				Email = signUpData.Email
			};

			var res = await _userManager.CreateAsync(user, signUpData.Password);

			if (res.Errors.Any())
				result.Errors.AddRange(res.Errors.Select(e => e.Description));
			else result.Item = true;

			return result;
		}

		private string GenerateJwtToken(DataBase.User user)
		{
			var claims = new List<Claim>
			{
				new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
			};

			var tokenHandler = new JwtSecurityTokenHandler();
			var key = Encoding.ASCII.GetBytes(_appSetting.TokenSecret);

			var tokenDescriptor = new SecurityTokenDescriptor
			{
				Subject = new ClaimsIdentity(claims),
				Expires = DateTime.UtcNow.AddHours(1),
				SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
			};

			var token = tokenHandler.CreateToken(tokenDescriptor);

			return tokenHandler.WriteToken(token);
		}
	}
}
