using System.Threading.Tasks;
using Tweeter.Application.DataBase;
using Tweeter.Application.DataBase.Dtos;
using Tweeter.Application.Models;

namespace Tweeter.Application.Contracts
{
	public interface ITweetCommentService
	{
		Task<PageResponse<TweetCommentDto>> SearchAsync(TweetCommentSearchParam param);
		Task<Response<int>> CreateAsync(TweetComment comment);
		Task<Response<bool>> LikeAsync(int commentId);
	}
}
