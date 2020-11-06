using System.Threading.Tasks;
using Tweeter.Application.Models;

namespace Tweeter.Application.Contracts
{
	public interface IAuthService
	{
		Task<Response<SignInResult>> SignIn(string login, string password);
		Task<Response<bool>> SignUp(SignUpData signUpData);
	}
}
