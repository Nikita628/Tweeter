using System.Collections.Generic;

namespace Tweeter.Application.Models
{
	public class BaseResponse
	{
		public List<string> Errors { get; set; } = new List<string>();
	}

	public class PageResponse<EntityType> : BaseResponse
	{
		public List<EntityType> Items { get; set; } = new List<EntityType>();
		public int TotalCount { get; set; }
	}

	public class Response<EntityType> : BaseResponse
	{
		public EntityType Item { get; set; }
	}
}
