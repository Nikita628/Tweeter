using System.Threading.Tasks;
using Tweeter.Application.Models;

namespace Tweeter.Application.Contracts
{
	public interface IAuthService
	{
		Task<Response<SignInResult>> SignInAsync(string login, string password);
		Task<Response<bool>> SignUpAsync(SignUpData signUpData);
	}
}
