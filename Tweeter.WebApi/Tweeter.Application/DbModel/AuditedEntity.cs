using System;

namespace Tweeter.Application.DbModel
{
	public class AuditedEntity
	{
		public int CreatedById { get; set; }
		public DateTime CreatedAt { get; set; }

		public User CreatedBy { get; set; }
	}
}
