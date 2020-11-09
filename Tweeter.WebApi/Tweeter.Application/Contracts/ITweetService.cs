using System.Threading.Tasks;
using Tweeter.Application.DataBase;
using Tweeter.Application.Models;

namespace Tweeter.Application.Contracts
{
	public interface ITweetService
	{
		Task<Response<int>> CreateAsync(Tweet tweet);
		Task<PageResponse<TweetDto>> SearchAsync(TweetSearchParam param);
		Task<Response<bool>> RetweetAsync(int tweetId);
		Task<Response<bool>> LikeAsync(int tweetId);
		Task<Response<bool>> BookmarkAsync(int tweetId);
	}
}
