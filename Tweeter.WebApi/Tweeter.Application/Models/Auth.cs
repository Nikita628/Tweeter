﻿namespace Tweeter.Application.Models
{
	public class SignInResult
	{
		public DataBase.User User { get; set; }
		public string Token { get; set; }
	}

	public class SignUpData
	{
		public string Email { get; set; }
		public string Password { get; set; }
		public string Name { get; set; }
	}
}
