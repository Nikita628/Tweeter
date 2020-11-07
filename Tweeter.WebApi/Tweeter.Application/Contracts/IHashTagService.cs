using System.Threading.Tasks;
using Tweeter.Application.DataBase;
using Tweeter.Application.Models;

namespace Tweeter.Application.Contracts
{
	public interface IHashTagService
	{
		Task<PageResponse<HashTag>> SearchAsync(HashTagSearchParam param);
	}
}
