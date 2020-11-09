using System;
using System.Threading.Tasks;
using Tweeter.Application.Contracts;
using Tweeter.Application.DataBase;
using Tweeter.Application.Models;

namespace Tweeter.Application.Services
{
	public class HashTagService : IHashTagService
	{
		public Task<PageResponse<HashTag>> SearchAsync(HashTagSearchParam param)
		{
			throw new NotImplementedException();
		}
	}
}
