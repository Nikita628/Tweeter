using System.Threading.Tasks;
using Tweeter.Application.Models;

namespace Tweeter.Application.Contracts
{
	public interface ITweetCommentService
	{
		Task<PageResponse<TweetCommentDto>> SearchAsync(TweetCommentSearchParam param);
		Task<Response<TweetCommentDto>> CreateAsync(TweetCommentForCreation comment);
		Task<Response<bool>> LikeAsync(int commentId);
	}
}
